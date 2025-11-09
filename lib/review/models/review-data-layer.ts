import { filterReviewWithAI, IResult } from '../helpers'
import sql from '@/lib/db'
import { Review } from '@/util/interfaces/interfaces'
import { ReviewResponseStatus } from '../types/Responses'
import { createUserCode } from '../user-codes'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { getExistingReviewsForLandlord } from '../landlords'
import {
	checkForLandlordSpam,
	checkReviewsForSimilarity,
	updateRecentReviews,
} from '../review-text-match'

dayjs.extend(isBetween)

export async function create(
	inputReview: Review,
): Promise<ReviewResponseStatus> {
	try {
		const existingReviewsForLandlord: Review[] =
			await getExistingReviewsForLandlord(inputReview)
		const reviewSpamDetected: boolean = checkReviewsForSimilarity(
			existingReviewsForLandlord,
			inputReview.review,
		)

		const landlordSpamDetected: boolean = await checkForLandlordSpam(
			inputReview.landlord,
		)

		// Don't post the review to the DB if we detect spam
		if (reviewSpamDetected || landlordSpamDetected)
			return {
				message:
					'This landlord is currently under spam protection please try again later',
				success: false,
				user_code: '',
				review_id: 0,
			}

		updateRecentReviews(inputReview.landlord).catch(() =>
			console.error(
				`Error Updating Recent Reviews for ${inputReview.landlord}`,
			),
		)
		if (process.env.NEXT_PUBLIC_ENVIRONMENT == 'development')
			return createReview(inputReview, {
				flagged: false,
				flagged_reason: 'DEV REVIEW',
			}) // Hit data layer to create review

		const filterResult: IResult = await filterReviewWithAI(inputReview)
		return createReview(inputReview, filterResult) // Hit data layer to create review
	} catch {
		throw new Error()
	}
}

async function createReview(
	inputReview: Review,
	filterResult: IResult,
): Promise<ReviewResponseStatus> {
	const { code, hashedCode } = createUserCode()
	try {
		inputReview.landlord = inputReview.landlord
			.substring(0, 150)
			.toLocaleUpperCase()
		inputReview.country_code = inputReview.country_code.toLocaleUpperCase()
		inputReview.city = inputReview.city.substring(0, 150).toLocaleUpperCase()
		inputReview.state = inputReview.state.toLocaleUpperCase()
		inputReview.zip = inputReview.zip
			.substring(0, 50)
			.toLocaleUpperCase()
			.replace(' ', '')
		inputReview.admin_approved = null
		inputReview.flagged = filterResult.flagged
		inputReview.flagged_reason = filterResult.flagged_reason

		const id = await sql<{ id: number }[]>`
          INSERT INTO review
          (landlord, country_code, city, state, zip, review, repair, health, stability, privacy, respect, flagged,
          flagged_reason, admin_approved, admin_edited, rent, user_code)
          VALUES
          (${inputReview.landlord}, ${inputReview.country_code}, ${
						inputReview.city
					}, ${inputReview.state},
          ${inputReview.zip}, ${inputReview.review}, ${inputReview.repair}, ${
						inputReview.health
					},
          ${inputReview.stability}, ${inputReview.privacy}, ${
						inputReview.respect
					}, ${inputReview.flagged},
          ${inputReview.flagged_reason}, ${inputReview.admin_approved}, ${
						inputReview.admin_edited
					}, ${inputReview.rent || null}, ${hashedCode})
          RETURNING id;
        `

		return {
			message: 'Review successfully added',
			review_id: id[0].id,
			success: true,
			user_code: code,
		}
	} catch (e) {
		console.error('Error Creating Review')
		throw e
	}
}
