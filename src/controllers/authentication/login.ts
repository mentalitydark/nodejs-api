import 'dotenv/config'
import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { authentication, random } from '@/helpers'
import { getUserByEmail } from '@/models/user'
import { BadRequest, InternalServerError, Unauthorized } from '@/errors'

export async function login(req: express.Request, res: express.Response) {
  try {

    const { email, password } = req.body

    if (!email || !password)
      return new BadRequest(res, {
        title: 'Parameters required',
        instance: '/api/auth/login'
      }, [
        {name: 'email', reason: 'This parameter is required', informed: email},
        {name: 'password', reason: 'This parameter is required', informed: password}
      ])

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')

    if (!user)
      return new BadRequest(res, {title: 'User not found', instance: '/api/auth/login'})

    const expectedHash = authentication(user.authentication.salt, password)

    if (user.authentication.password !== expectedHash)
      return new Unauthorized(res, {title: 'E-mail or password incorrect', instance: '/api/auth/login'})

    const salt = random()
    user.authentication.sessionToken = authentication(salt, user._id.toString())

    await user.save()

    res.cookie(process.env.COOKIE_AUTH, user.authentication.sessionToken, { domain: 'localhost', path: '/' })

    return res.status(StatusCodes.OK).json(user).end()
  } catch (err) {
    console.error(err)
    return new InternalServerError(res, err)
  }
}