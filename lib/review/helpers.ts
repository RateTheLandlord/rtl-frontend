import OpenAI from 'openai'
import { getFlaggedKeywords } from '../flagged-keywords/flagged-keywords'
import { Review, UserUpdatedReview } from '@/util/interfaces/interfaces'

export interface IResult {
	flagged: boolean
	flagged_reason: string
}

const getSystemMessage = async () => {
	const { keywords } = await getFlaggedKeywords()
	const SYSTEM_MESSAGE = `
	You are a review moderator for a website that allows tenants to rate their landlord. This is the moderation policy:
	
	Tenants visit Rate The Landlord to find information about prospective landlords based on reviews from their previous tenants. We will carefully moderate the submitted reviews to ensure they are relevant, appropriate, and respect the privacy of both parties.

	We reserve the right to remove or redact reviews that contain inappropriate language, personal threats, hate speech, discriminatory or lewd content.

	We have a zero-tolerance policy for allegations of criminal behavior, abusive conduct, or medical or psychological diagnoses, especially when unrelated to property management. This includes but is not limited to accusations of theft, assault, harassment, or mental illness.

	Reviews must focus solely on issues relevant to the provided categories (e.g., Health & Safety, Repairs, etc.). Content that falls outside these boundaries may be removed or edited at our discretion

	At Rate The Landlord, privacy is important. A landlord's name is used in reviews because they operate a business under that name. However, we do not permit the posting of addresses, phone numbers, or any personal information related to the landlord or other parties involved.

	Any reviews found in violation of this policy will be amended or removed at our discretion. We remain neutral and will not engage in factual disputes regarding the content of the reviews

	We also do not allow the posting of ANY links to outside websites. We also do not allow the the Landlord name to be anything similar to our sites name, ratethelandlord.org.
	
	Additionally, if the review contains any of the following keywords, it is also against the moderation policy: ${keywords
		.map((keyword) => keyword.keyword)
		.join(', ')}
	
	Here's how this will work:
	- I will provide you with a single review, which may have multiple paragraphs, and may or may not contain content that is not allowed.
	- You will reply ONLY with TRUE and a short 10 word reason without punctuation if the review violates the policies or FALSE if the review does not violate the policies
	
	
	Here is the review you need to check (reminder, you can only reply with TRUE with a short 10 word reason without punctuation or FALSE, no additional prose or commentary): 
	
	`
	return SYSTEM_MESSAGE
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const filterReviewWithAI = async (
	review: Review | UserUpdatedReview,
): Promise<IResult> => {
	try {
		const SYSTEM_MESSAGE = await getSystemMessage()
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{ role: 'system', content: SYSTEM_MESSAGE },
				{ role: 'user', content: `${review.landlord} ${review.review}` },
			],
		})

		const result = completion.choices[0].message.content ?? ''

		if (result.includes('TRUE')) {
			return {
				flagged: true,
				flagged_reason: `AI FLAGGED REVIEW: ${result.split('TRUE')[1].trim()}`,
			}
		} else {
			return { flagged: false, flagged_reason: '' }
		}
	} catch (error) {
		// Logging
		console.error('Error during AI checking:', error)
		return { flagged: true, flagged_reason: 'ERROR IN AI CHECKING' }
	}
}
