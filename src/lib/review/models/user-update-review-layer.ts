import { Review, UserUpdatedReview } from '@/util/interfaces/interfaces'
import { Message, UserUpdateReviewResponse } from '../types/Responses'
import sql from '@/lib/db'
import isWithinLastDay from '@/util/helpers/isWithinLastDay'
import { checkUserCode } from '../user-codes'
import { filterReviewWithAI, IResult } from '../helpers'

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
	const user_attempts = Number(currentReview.number_user_attempts)

	// Too Many Attempts in the last day
	if (user_attempts >= 3 && isWithinLastDay(currentReview.last_user_attempt)) {
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
				number_user_attempts = ${user_attempts + 1 || 0 + 1}

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
			   moderator = null
           WHERE id = ${id};`
		return {
			success: true,
			message: Message.SUCCESS,
		}
	}
}
