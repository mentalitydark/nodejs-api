import 'dotenv/config'
import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { authentication, random } from '@/helpers'
import { getUserByEmail } from '@/models/user'
import { BadRequest, InternalServerError, Unauthorized } from '@/errors'
import z, { ZodError } from 'zod'
import { UserSchema } from '@/schemas'

export async function login(req: express.Request, res: express.Response) {
  try {
    const loginSchema = z.object({
      email: UserSchema.email,
      password: UserSchema.password,
    })
    const { email, password } = loginSchema.parse(req.body)

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')

    if (!user)
      return new BadRequest(res, {title: 'User not found', instance: req.url})

    const expectedHash = authentication(user.authentication.salt, password)

    if (user.authentication.password !== expectedHash)
      return new Unauthorized(res, {title: 'E-mail or password incorrect', instance: req.url})

    const salt = random()
    user.authentication.sessionToken = authentication(salt, user._id.toString())

    await user.save()

    res.cookie(process.env.COOKIE_AUTH, user.authentication.sessionToken)

    return res.status(StatusCodes.OK).json(user).end()
  } catch (err) {
    if (err instanceof ZodError)
      return new BadRequest(res, {title: 'Parameters required', instance: req.url}, err.issues)

    console.error(err)
    return new InternalServerError(res, err)
  }
}