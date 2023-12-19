import { BadRequest, InternalServerError } from '@/errors'
import { getUserById } from '@/models/user'
import { UserSchema } from '@/schemas'
import express from 'express'
import { get } from 'lodash'
import z, { ZodError } from 'zod'

export async function update(req: express.Request, res: express.Response) {
  try {
    const currentUserId = get(req, 'identity._id') as string

    const updateSchema = z.object({username: UserSchema.username})
    const { username } = updateSchema.parse(req.body)

    const user = await getUserById(currentUserId)
    user.username = username
    await user.save()

    return res.status(200).json(user).end()
  } catch (err) {
    if (err instanceof ZodError)
      return new BadRequest(res, {title: 'Parameters required', instance: req.url}, err.issues)

    console.error(err)
    return new InternalServerError(res, err)
  }
}