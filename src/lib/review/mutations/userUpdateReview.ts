import sql from '@/lib/db'
import type { UserUpdatedReview } from '@/util/interfaces/Interfaces'
import { filterReviewWithAI } from '../moderation/checkReviewWithAI'
import { Message, type UserUpdateReviewResponse } from '../types/Responses'
import { authorizeReviewCode } from './authorizeReviewCode'

export async function userUpdateReview(
	id: number,
	review: UserUpdatedReview,
	userCode: string,
): Promise<UserUpdateReviewResponse> {
	const authorization = await authorizeReviewCode(id, userCode)
	if (!authorization.success) return authorization

	const moderation = await filterReviewWithAI(review)
	const updated = await sql`
		UPDATE review
		SET landlord = ${review.landlord.substring(0, 150).toLocaleUpperCase()},
			review = ${review.review},
			repair = ${review.repair},
			health = ${review.health},
			stability = ${review.stability},
			privacy = ${review.privacy},
			respect = ${review.respect},
			flagged = ${moderation.flagged},
			flagged_reason = ${moderation.flagged_reason},
			admin_approved = false,
			admin_edited = false,
			rent = ${review.rent || null},
			moderation_reason = null,
			moderator = null
		WHERE id = ${id} AND user_code = ${authorization.codeHash}
	`

	if (updated.count === 0) {
		return { success: false, message: Message.NOT_FOUND }
	}
	return { success: true, message: Message.SUCCESS }
}
