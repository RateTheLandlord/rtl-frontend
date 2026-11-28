import sql from '@/lib/db'

export const publicReviewCondition = sql`
	delete_date IS NULL
	AND (flagged = false OR (flagged = true AND admin_approved = true))
`

// Queries that feed pages or public APIs must never select the stored review code.
export const publicReviewColumns = sql`
	id,
	landlord,
	country_code,
	city,
	state,
	zip,
	review,
	repair,
	health,
	stability,
	privacy,
	respect,
	date_added,
	admin_edited,
	rent,
	moderation_reason,
	has_user_code,
	suspicious_reason
`
