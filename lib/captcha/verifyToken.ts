const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

interface CaptchaResponse {
	success: boolean
}

export async function verifyToken(token: string): Promise<boolean> {
	const secret = process.env.CAPTCHA_SECRET_KEY

	if (!secret || typeof token !== 'string' || token.trim().length === 0) {
		return false
	}

	try {
		const body = new URLSearchParams({
			secret,
			response: token,
		})

		const response = await fetch(VERIFY_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: body.toString(),
			signal: AbortSignal.timeout(5000),
		})

		if (!response.ok) {
			return false
		}

		const result = (await response.json()) as CaptchaResponse
		return result.success === true
	} catch {
		return false
	}
}
