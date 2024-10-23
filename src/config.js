import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 3000
const SALT_ROUNT = 10
const KEY_VERIFICATION = process.env.KEY_VERIFICATION
export { PORT, SALT_ROUNT, KEY_VERIFICATION }


