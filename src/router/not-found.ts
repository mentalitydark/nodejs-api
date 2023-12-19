import express from 'express'

import { NotFound } from '@/errors'

export function notFound(req: express.Request, res: express.Response) {
  return new NotFound(res, {
    title: 'Route not found',
    detail: 'This route has not been implemented or the method is different',
    instance: req.url
  })
}