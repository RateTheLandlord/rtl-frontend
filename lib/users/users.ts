import sql from '../db'
import { IUser } from './models/types'

export async function deleteUser(id: number): Promise<boolean> {
	await sql`DELETE FROM users WHERE ID = ${id}`

	return true
}

export async function update(id: number, user: IUser): Promise<boolean> {
	await sql`UPDATE users SET name = ${user.name}, email= ${user.email} WHERE id = ${id}`

	return true
}

export async function getAll(): Promise<IUser[]> {
	return sql<IUser[]>`Select * FROM users`
}

export async function create(user: IUser): Promise<IUser> {
	const id = (
		await sql<{ id: number }[]>`
        INSERT INTO users (name, email, role) VALUES ( ${user.name}, ${user.email}, ${user.role}) RETURNING id
        ;`
	)[0].id
	user.id = id
	return user
}
