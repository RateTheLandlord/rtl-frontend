import sql from '@/lib/db'
import { Message, type UserUpdateReviewResponse } from '../types/Responses'
import { authorizeReviewCode } from './authorizeReviewCode'

export async function userDeleteReview(
	id: number,
	userCode: string,
): Promise<UserUpdateReviewResponse> {
	const authorization = await authorizeReviewCode(id, userCode)
	if (!authorization.success) return authorization

	const deleted = await sql`
		DELETE FROM review
		WHERE id = ${id} AND user_code = ${authorization.codeHash}
	`

	if (deleted.count === 0) {
		return { success: false, message: Message.NOT_FOUND }
	}
	return { success: true, message: Message.SUCCESS }
}
