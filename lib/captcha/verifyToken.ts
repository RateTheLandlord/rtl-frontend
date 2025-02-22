/* eslint-disable @typescript-eslint/no-unsafe-assignment */
interface CaptchaPayload {
	secret: string
	response: string
}

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

export async function verifyToken(token: string): Promise<boolean> {
	const data: CaptchaPayload = {
		secret: process.env.CAPTCHA_SECRET_KEY as string,
		response: token,
	}

	const req = await fetch(
		`${VERIFY_URL}?secret=${data.secret}&response=${token}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
	)

	const response = await req.json()

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const success: boolean = await response.success

	return success
}
