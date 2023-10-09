import path from 'path'

const NODE_ENV = process.env.NODE_ENV ?? 'development'
const envPath =
  NODE_ENV === 'development' ? path.resolve(process.cwd(), '.env') : path.resolve(process.cwd(), `.env.${NODE_ENV}`)

require('dotenv').config({ path: envPath })
