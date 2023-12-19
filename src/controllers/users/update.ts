import { BadRequest, InternalServerError } from '@/errors'
import { getUserById } from '@/models/user'
import express from 'express'

export async function update(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params
    const { username } = req.body

    if (!username)
      return new BadRequest(res, { title: 'Parameters required', instance: '/api/users' }, [
      {name: 'username', reason: 'This parameter is required', informed: username}
    ])

    const user = await getUserById(id)
    user.username = username
    await user.save()

    return res.status(200).json(user).end()
  } catch (err) {
    console.error(err)
    return new InternalServerError(res, err)
  }
}