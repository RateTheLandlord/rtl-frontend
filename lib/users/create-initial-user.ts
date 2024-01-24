import sql from '../db'

export async function createAdminUser() {
	const userRepository = await sql`SELECT * FROM users;`
	console.log('CHECKING FOR ADMIN')

	if (userRepository.length < 1) {
		console.log('ADMIN NOT FOUND, CREATING ADMIN...')

		const id = (
			await sql`
        INSERT INTO users (name, email, role) VALUES ( ${'admin'}, ${
				process.env.INITIAL_USER_EMAIL || ''
			}, ${'ADMIN'}) RETURNING id
        ;`
		)[0].id
		console.log('ADMIN CREATED WITH ID: ', id)
	} else {
		console.log('ADMIN NOT CREATED')
	}
}
