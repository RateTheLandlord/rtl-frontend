import { filterReviewWithAI, IResult } from '../helpers'
import sql from '@/lib/db'
import { Review, UserUpdatedReview } from '@/util/interfaces/interfaces'
import {
	Message,
	ReviewResponseStatus,
	UserUpdateReviewResponse,
} from '../types/Responses'
import { checkUserCode, createUserCode } from '../user-codes'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

/**
 * Data service layer for the reviews service of our backend.
 * Provides methods to create, retrieve, update or handle any other CRUD operations for reviews in the database.
 */

export async function createReview(
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

		await sql<{ id: number }[]>`
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
			success: true,
			user_code: code,
		}
	} catch (e) {
		console.error('Error Creating Review')
		throw e
	}
}

export async function updateReview(
	id: number,
	review: Review,
): Promise<Review> {
	await sql`UPDATE review
           SET landlord = ${review.landlord
							.substring(0, 150)
							.toLocaleUpperCase()},
               country_code = ${review.country_code.toLocaleUpperCase()},
               city = ${review.city.substring(0, 150).toLocaleUpperCase()},
               state = ${review.state.toLocaleUpperCase()},
               zip = ${review.zip
									.substring(0, 50)
									.toLocaleUpperCase()
									.replace(' ', '')},
               review = ${review.review},
               repair = ${review.repair},
               health = ${review.health},
               stability = ${review.stability},
               privacy = ${review.privacy},
               respect = ${review.respect},
               flagged = ${review.flagged},
               flagged_reason = ${review.flagged_reason},
               admin_approved = ${review.admin_approved},
               admin_edited   = ${review.admin_edited},
			   rent = ${review.rent || null},
			   moderation_reason = ${review.moderation_reason || null},
			   moderator = ${review.moderator},
			   delete_date = ${review.delete_date},
			   delete_reason = ${review.delete_reason},
			   deleted_by = ${review.deleted_by},
			   restore_date = ${review.restore_date},
			   restore_reason = ${review.restore_reason},
			   restored_by = ${review.restored_by}
           WHERE id = ${id};`

	return review
}

function isWithinLastDay(lastAttempt: Date) {
	const currDate = new Date()
	const yesterday = dayjs(currDate).subtract(1, 'day')
	return dayjs(lastAttempt).isBetween(yesterday, currDate)
}

export async function userUpdateReview(
	id: number,
	review: UserUpdatedReview,
	userCode: string,
): Promise<UserUpdateReviewResponse> {
	//Get Review Code from Review ID
	const selectedReviews = await sql<Review[]>`
		SELECT user_code, number_user_attempts, last_user_attempt FROM review WHERE id = ${id};
	`

	// Review not found in DB
	if (selectedReviews.length < 1) {
		return {
			success: false,
			message: Message.NOT_FOUND,
		}
	}

	const currentReview = selectedReviews[0]

	// Too Many Attempts in the last day
	if (
		currentReview.number_user_attempts >= 3 &&
		isWithinLastDay(currentReview.last_user_attempt)
	) {
		return {
			success: false,
			message: Message.RATE_LIMIT,
		}
	}

	// No user code in review
	if (!currentReview.user_code) {
		return {
			success: false,
			message: Message.NO_CODE,
		}
	}

	//Check that code matches the review
	const isUpdateAllowed = await checkUserCode(userCode, currentReview.user_code)
	if (!isUpdateAllowed) {
		await sql`UPDATE review
           SET 	last_user_attempt = ${new Date()},
				number_user_attempts = ${currentReview.number_user_attempts || 0 + 1},

           WHERE id = ${id};`
		return {
			success: false,
			message: Message.INCORRECT,
		}
	} else {
		//update review data if pass
		const filterResult: IResult = await filterReviewWithAI(review)
		await sql`UPDATE review
           SET landlord = ${review.landlord
							.substring(0, 150)
							.toLocaleUpperCase()},
               
               review = ${review.review},
               repair = ${review.repair},
               health = ${review.health},
               stability = ${review.stability},
               privacy = ${review.privacy},
               respect = ${review.respect},
               flagged = ${filterResult.flagged},
               flagged_reason = ${filterResult.flagged_reason},
               admin_approved = false,
               admin_edited   = false,
			   rent = ${review.rent || null},
			   moderation_reason = null,
			   moderator = null,
           WHERE id = ${id};`
		return {
			success: true,
			message: Message.SUCCESS,
		}
	}
}
