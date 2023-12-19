import 'dotenv/config'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import express from 'express'
import http from 'http'
import cors from 'cors'

import router from '@/router'
import { notFound } from './router/not-found'

const app = express()
app.use(cors({
  credentials: true
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`)
})

mongoose.Promise = Promise
mongoose.connect(process.env.MONGODB_URL)
mongoose.connection.on('error', (error: Error) => console.log(error))
mongoose.connection.on('connection', () => console.log('MongoDB connected'))

app.use('/api/', router())
app.use(notFound)