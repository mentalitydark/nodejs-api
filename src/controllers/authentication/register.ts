import express from "express"
import validator from 'validator'
import { StatusCodes } from "http-status-codes"

import { authentication, random } from "@/helpers"
import { createUser, getUserByEmail } from "@/models/user"
import { BadRequest, InternalServerError } from "@/errors"

export async function register(req: express.Request, res: express.Response) {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username)
      return new BadRequest(res, {
        title: 'Parameters required',
        instance: '/api/auth/register'
      }, [
        {name: 'email', reason: 'This parameter is required', informed: email},
        {name: 'password', reason: 'This parameter is required', informed: password},
        {name: 'username', reason: 'This parameter is required', informed: username}
      ])

    if (!validator.isEmail(email))
      return new BadRequest(res, {
        title: 'Invalid email',
        instance: '/api/auth/register'
      }, [{name: 'email', reason: `'${email}' is invalid`}])

    const existingUser = await getUserByEmail(email)

    if (existingUser)
      return new BadRequest(res, {
        title: 'Invalid email',
        detail: 'This e-mail address is already in use',
        instance: '/api/auth/register'
      })

    const salt = random()
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password)
      }
    })

    return res.status(StatusCodes.CREATED).json(user).end()

  } catch (err) {
    console.error(err)
    return new InternalServerError(res, err)
  }
}