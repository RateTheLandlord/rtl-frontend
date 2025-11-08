import sql from '@/lib/db'
import { Review } from '@/util/interfaces/interfaces'

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
