import sql from '@/lib/db'
import { Message } from '../types/Responses'
import { checkUserCode } from '../userCodes'

const MAX_ATTEMPTS = 3

type ReviewCodeCheck =
	{ success: true; codeHash: string } | { success: false; message: Message }

type ReviewCodeRow = {
	user_code: string | null
	number_user_attempts: string | number | null
	within_attempt_window: boolean
}

export function authorizeReviewCode(
	id: number,
	userCode: string,
): Promise<ReviewCodeCheck> {
	// Serialize attempts for the same review across edit and delete requests.
	return sql.begin<ReviewCodeCheck>(async (tx) => {
		const [review] = await tx<ReviewCodeRow[]>`
			SELECT
				user_code,
				number_user_attempts,
				COALESCE(
					last_user_attempt > clock_timestamp()::timestamp - INTERVAL '24 hours', false
				) AS within_attempt_window
			FROM review
			WHERE id = ${id}
			FOR UPDATE
		`

		if (!review) return { success: false, message: Message.NOT_FOUND }
		if (!review.user_code) return { success: false, message: Message.NO_CODE }

		const attempts = review.within_attempt_window
			? Number(review.number_user_attempts ?? 0)
			: 0

		if (attempts >= MAX_ATTEMPTS) {
			return { success: false, message: Message.RATE_LIMIT }
		}

		if (await checkUserCode(userCode, review.user_code)) {
			return { success: true, codeHash: review.user_code }
		}

		await tx`
			UPDATE review
			SET number_user_attempts = ${attempts + 1},
				last_user_attempt = clock_timestamp()::timestamp
			WHERE id = ${id}
		`
		return { success: false, message: Message.INCORRECT }
	})
}
