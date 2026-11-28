import OpenAI from 'openai'
import { getFlaggedKeywords } from '@/lib/flaggedKeywords/flaggedKeywords'
import type { Review } from '@/util/interfaces/Interfaces'
import { MODERATION_PROMPT } from './moderationPrompt'

export interface IResult {
	flagged: boolean
	flagged_reason: string
}

const categoryReasons = {
	allowed: '',
	private_information: 'Potentially identifying personal information',
	abusive_content: 'Potentially abusive or inappropriate content',
	prohibited_allegation: 'Potentially prohibited allegation or diagnosis',
	off_topic: 'Content may be unrelated to the rental experience',
	prohibited_link: 'External link',
	misleading_landlord_name: 'Landlord name may impersonate Rate The Landlord',
	flagged_keyword: 'Match against the moderation keyword list',
	manual_review: 'Submission needs a human moderation decision',
} as const

type Category = keyof typeof categoryReasons

const manualReview: IResult = {
	flagged: true,
	flagged_reason: 'AI moderation did not complete. Needs human review.',
}

function parseCategory(content: string): Category | undefined {
	const result: unknown = JSON.parse(content)
	if (
		typeof result !== 'object' ||
		result === null ||
		!('category' in result)
	) {
		return undefined
	}

	const { category } = result
	if (
		typeof category !== 'string' ||
		!Object.hasOwn(categoryReasons, category)
	) {
		return undefined
	}

	return category as Category
}

let openai: OpenAI | undefined

export async function filterReviewWithAI(
	review: Pick<Review, 'landlord' | 'review'>,
): Promise<IResult> {
	try {
		const client = (openai ??= new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		}))
		const { keywords } = await getFlaggedKeywords()
		const flaggedKeywords = keywords
			.map(({ keyword }) => keyword.trim())
			.filter(Boolean)

		const completion = await client.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{ role: 'system', content: MODERATION_PROMPT },
				{
					role: 'system',
					content: JSON.stringify({ flaggedKeywords }),
				},
				{
					role: 'user',
					content: JSON.stringify({
						landlordName: review.landlord,
						review: review.review,
					}),
				},
			],
			response_format: {
				type: 'json_schema',
				json_schema: {
					name: 'review_moderation',
					strict: true,
					schema: {
						type: 'object',
						properties: {
							category: { type: 'string', enum: Object.keys(categoryReasons) },
						},
						required: ['category'],
						additionalProperties: false,
					},
				},
			},
		})

		const decision = completion.choices[0]
		if (
			decision?.finish_reason !== 'stop' ||
			decision.message.refusal ||
			!decision.message.content
		) {
			return manualReview
		}

		const category = parseCategory(decision.message.content)
		if (!category) return manualReview
		if (category === 'allowed') return { flagged: false, flagged_reason: '' }

		return {
			flagged: true,
			flagged_reason: `AI FLAGGED REVIEW: ${categoryReasons[category]}`,
		}
	} catch {
		console.error('AI review moderation failed')
		return manualReview
	}
}
