import fastify from "fastify"
import fastifyCors from '@fastify/cors'
import authRoute from './routes/auth.js'

const buildServer = (opts = {}) => {
  const app = fastify(opts)

  app.register(fastifyCors, {})

  // routes
  app.register(authRoute)

  return app
}

export default buildServer
