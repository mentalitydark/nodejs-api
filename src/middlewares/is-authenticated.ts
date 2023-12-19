import 'dotenv/config'
import express from 'express'
import { merge } from 'lodash'

import { getUserBySessionToken } from '@/models/user'
import { Forbidden, InternalServerError } from '@/errors'

export async function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const sessionToken = req.cookies[process.env.COOKIE_AUTH]

    if (!sessionToken)
      return new Forbidden(res, { title: 'Authentication required' })

    const existingUser = await getUserBySessionToken(sessionToken)

    if (!existingUser)
      return new Forbidden(res, { title: 'Authentication required' })

      merge(req, { identity: existingUser })

      return next()
  } catch (err) {
    console.error(err)
    return new InternalServerError(res, err)
  }
}
