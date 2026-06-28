import postgres from 'postgres'

const isProd = process.env.NODE_ENV === 'production'

const globalForPostgres = globalThis as unknown as {
	sql: postgres.Sql | undefined
}

export const sql =
	globalForPostgres.sql ??
	postgres(process.env.DATABASE_URL as string, {
		max: isProd ? 17 : 5,
		idle_timeout: 30,
	})

if (!isProd) {
	globalForPostgres.sql = sql
}

export default sql
