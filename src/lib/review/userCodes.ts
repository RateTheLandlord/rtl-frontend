import { randomInt } from 'node:crypto'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10
const CODE_LENGTH = 12
const CODE_ALPHABET =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export async function createUserCode() {
	let code = ''
	for (let index = 0; index < CODE_LENGTH; index++) {
		code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
	}
	const hashedCode = await bcrypt.hash(code, SALT_ROUNDS)
	return { code, hashedCode }
}

export function checkUserCode(userCode: string, reviewCode: string) {
	return bcrypt.compare(userCode, reviewCode)
}
