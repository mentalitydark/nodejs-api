import { BadRequest, Forbidden, InternalServerError } from '@/errors'
import express from 'express'
import { get } from 'lodash'

export function isOwner(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const { id } = req.params
    const currentUserId = get(req, 'identity._id') as string

    if (!currentUserId)
      return new Forbidden(res, { title: 'Access denied' })

    if (currentUserId.toString() !== id)
      return new Forbidden(res, { title: 'Access denied' })

    next()
  } catch (err) {
    console.error(err)
    return new InternalServerError(res, err)
  }
}