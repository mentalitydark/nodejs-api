import express from 'express'
import { isAuthenticated, isOwner } from '@/middlewares'
import { getAll, remove, update } from '@/controllers/users'

export default function(router: express.Router) {
  router.get('/users', isAuthenticated, getAll)
  router.delete('/users/:id', isAuthenticated, isOwner, remove)
  router.put('/users/:id', isAuthenticated, isOwner, update)
}