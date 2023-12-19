import { InternalServerError, NotFound } from '@/errors'
import { deleteUserById, getUserById } from '@/models/user'
import express from 'express'
import { StatusCodes } from 'http-status-codes'

export async function remove(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params

    const userExists = await getUserById(id)
    if (!userExists)
      return new NotFound(res, { title: 'User does not exist', instance: `/api/users/${id}`})

    const deletedUser = await deleteUserById(id)
    return res.status(StatusCodes.OK).json(deletedUser)
  } catch (err) {
    console.error(err)
    return new InternalServerError(res, err)
  }
}