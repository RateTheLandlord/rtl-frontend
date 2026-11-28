const auth0Variables = [
	'AUTH0_DOMAIN',
	'AUTH0_CLIENT_ID',
	'AUTH0_CLIENT_SECRET',
	'APP_BASE_URL',
	'AUTH0_SECRET',
] as const

function isValidDatabaseUrl(value: string): boolean {
	try {
		const url = new URL(value)
		return url.protocol === 'postgres:' || url.protocol === 'postgresql:'
	} catch {
		return false
	}
}

function isValidAppBaseUrl(value: string): boolean {
	try {
		const url = new URL(value)
		return url.protocol === 'http:' || url.protocol === 'https:'
	} catch {
		return false
	}
}

export function validateRuntimeEnvironment(): void {
	const errors: string[] = []
	const databaseUrl = process.env.DATABASE_URL?.trim()

	if (!databaseUrl) {
		errors.push('DATABASE_URL is required')
	} else if (!isValidDatabaseUrl(databaseUrl)) {
		errors.push('DATABASE_URL must be a valid PostgreSQL connection URL')
	}

	const isProduction = process.env.NODE_ENV === 'production'
	const auth0IsConfigured = auth0Variables.some((name) =>
		process.env[name]?.trim(),
	)

	if (isProduction || auth0IsConfigured) {
		for (const name of auth0Variables) {
			if (!process.env[name]?.trim()) {
				errors.push(`${name} is required to enable Auth0`)
			}
		}

		const appBaseUrl = process.env.APP_BASE_URL?.trim()
		if (appBaseUrl && !isValidAppBaseUrl(appBaseUrl)) {
			errors.push('APP_BASE_URL must be an absolute HTTP or HTTPS URL')
		}
	}

	if (isProduction && !process.env.CAPTCHA_SECRET_KEY?.trim()) {
		errors.push('CAPTCHA_SECRET_KEY is required in production')
	}

	if (errors.length > 0) {
		throw new Error(
			`Invalid server environment configuration:\n- ${errors.join('\n- ')}`,
		)
	}
}
