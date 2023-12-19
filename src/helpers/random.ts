import crypto from 'crypto'

export function random() {
  return crypto.randomBytes(128).toString('base64')
}