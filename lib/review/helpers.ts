import BadWordsFilter from 'bad-words'
import { Review } from '@/lib/review/models/review'
import OpenAI from 'openai'

export interface IResult {
	flagged: boolean
	flagged_reason: string
}

const keywords = process.env.AI_KEYWORDS

const SYSTEM_MESSAGE = `
You are a review moderator for a website that allows tenants to rate their landlord. This is the moderation policy:

Tenants visit Rate The Landlord to find information on prospective landlords based on reviews from their previous tenants. We will carefully moderate the submitted reviews to ensure they are relevant, appropriate, and respect the privacy of both parties.

We strictly prohibit the posting of threats, hate speech, lewd or discriminatory language.

At Rate The Landlord, privacy is important. A landlord's name is used in reviews because they operate a business under that name. However, we do not permit the posting of addresses, phone numbers, or any personal information related to the landlord or other parties involved.

Any reviews found in violation of this policy will be amended or removed at our discretion. We remain neutral and will not engage in factual disputes regarding the content of the reviews.

Additionally, if the review contains the following keywords, it is also against the moderation policy: ${keywords}

Here's how this will work:
- I will provide you with a single review, which may have multiple paragraphs, and may or may not contain content that is not allowed.
- You will reply ONLY with TRUE and a short 5 word reason without punctuation if the review violates the policies or FALSE if the review does not violate the policies


Here is the review you need to check (reminder, you can only reply with TRUE with a short 5 word reason without punctuation or FALSE, no additional prose or commentary): 

`

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const filterReviewWithAI = async (review: Review): Promise<IResult> => {
	try {
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
	} catch (e) {
		throw e
	}
}

const badWordsFilter = new BadWordsFilter()

export const filterReview = (review: Review) => {
	// Replace addresses
	// This pattern is more permissive and covers a wider range of addresses, but may also have false positives
	const addressPattern =
		/(^|\s)\d+\s+\w+(\s+\w+)*(,\s*\w+(\s+\w+)*)*(\s+(Avenue|Street|Road|Boulevard|Drive|Terrace|Place|Court|Crescent|Lane|Parkway|Way|Circle|Heights|Loop|Alley|Run|Glen|Bend|Plaza|Trace|Row|Rd|St|Dr|Cres|Ave))?(\.)?(?=\s|$)/gi
	// Replace phone numbers
	const phonePattern =
		/(\+\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?(\d{1,4}[-.\s]?){2,4}\d{1,4}([-.\s]?(x|ext\.?|extension)\s?\d{1,6})?/gi

	// Replace emails
	const emailPattern = /[\w\.-]+@[\w\.-]+\.\w+/gi

	if (addressPattern.test(review.review)) {
		return { flagged: true, reason: 'Filter Flagged for Address' }
	} else if (emailPattern.test(review.review)) {
		return { flagged: true, reason: 'Filter Flagged for Email' }
	} else if (phonePattern.test(review.review)) {
		return { flagged: true, reason: 'Filter flagged for Phone Number' }
	} else if (badWordsFilter.isProfane(review.review)) {
		return { flagged: true, reason: 'Filter flagged for Language' }
	} else {
		return { flagged: false, reason: '' }
	}
}
