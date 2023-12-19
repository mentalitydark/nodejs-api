import express from "express"
import { StatusCodes } from "http-status-codes"

import { authentication, random } from "@/helpers"
import { createUser, getUserByEmail } from "@/models/user"
import { BadRequest, InternalServerError } from "@/errors"
import z, { ZodError } from "zod"
import { UserSchema } from "@/schemas"

export async function register(req: express.Request, res: express.Response) {
  try {
    const registerSchema = z.object(UserSchema)

    const { email, password, username } = registerSchema.parse(req.body)

    const existingUser = await getUserByEmail(email)

    if (existingUser)
      return new BadRequest(res, {
        title: 'Invalid email',
        detail: 'This e-mail address is already in use',
        instance: req.url
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
    if (err instanceof ZodError)
      return new BadRequest(res, {title: 'Parameters required', instance: req.url}, err.issues)
    
    console.error(err)
    return new InternalServerError(res, err)
  }
}