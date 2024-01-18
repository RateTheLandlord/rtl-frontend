import { config } from 'dotenv'
import { parse } from 'pg-connection-string'

config({ path: '.env' })

const options = parse(process.env.DATABASE_URL || '')

export default options
