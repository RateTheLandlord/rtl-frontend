import { IResult } from '../helpers'
import sql from '@/lib/db'
import { Review } from '@/util/interfaces/interfaces'
import { ReviewResponseStatus } from '../types/Responses'
import bcrypt from 'bcrypt'

/**
 * Data service layer for the reviews service of our backend.
 * Provides methods to create, retrieve, update or handle any other CRUD operations for reviews in the database.
 */

function generateRandomString() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < 12; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

const SALT_ROUNDS = 10

function CreateUserCode() {
	const code = generateRandomString()
	const hashedCode = bcrypt.hashSync(code, SALT_ROUNDS)
	return { code, hashedCode }
}

export async function createReview(
	inputReview: Review,
	filterResult: IResult,
): Promise<ReviewResponseStatus> {
	const { code, hashedCode } = CreateUserCode()
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
