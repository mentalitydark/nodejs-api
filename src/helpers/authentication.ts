import crypto from 'crypto'
import 'dotenv/config'

export function authentication(salt: string, password: string) {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(process.env.SECRET_KEY).digest('hex')
}