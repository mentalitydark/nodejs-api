import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { InternalServerError } from '@/errors'
import { getUsers } from '@/models/user'

export async function getAll(req: express.Request, res: express.Response) {
  try {
    const users = await getUsers()
    return res.status(StatusCodes.OK).json(users)
  } catch (err) {
    console.error(err)
    return new InternalServerError(res, err)
  }
}