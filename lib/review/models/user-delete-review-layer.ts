import sql from '@/lib/db'
import { Review } from '@/util/interfaces/interfaces'
import { Message } from '../types/Responses'
import isWithinLastDay from '@/util/helpers/isWithinLastDay'
import { checkUserCode } from '../user-codes'

export async function userDeleteReview(id: number, userCode: string) {
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
		await sql`DELETE
				FROM review
				WHERE ID = ${id};`
		return {
			success: true,
			message: Message.SUCCESS,
		}
	}
}
