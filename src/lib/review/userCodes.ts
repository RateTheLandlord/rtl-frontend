import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

function generateRandomString() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < 12; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

export function createUserCode() {
	const code = generateRandomString()
	const hashedCode = bcrypt.hashSync(code, SALT_ROUNDS)
	return { code, hashedCode }
}

export function checkUserCode(userCode: string, reviewCode: string) {
	return bcrypt.compare(userCode, reviewCode)
}
