import { Forbidden, InternalServerError } from '@/errors'
import express from 'express'
import { get } from 'lodash'

export function isOwner(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const { id } = req.params
    const currentUserId = get(req, 'identity._id') as string

    if (!currentUserId)
      return new Forbidden(res, { title: 'Access denied', detail: 'User authenticated not found', instance: req.url })

    if (currentUserId.toString() !== id)
      return new Forbidden(res, { title: 'Access denied', detail: 'Different user' , instance: req.url })

    next()
  } catch (err) {
    console.error(err)
    return new InternalServerError(res, err)
  }
}