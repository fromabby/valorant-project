import fastify, { FastifyInstance } from "fastify"
import fastifyCors from '@fastify/cors'

const buildServer = (opts = {}): FastifyInstance => {
  const app: FastifyInstance = fastify(opts)

  app.register(fastifyCors, {})

  return app
}

export default buildServer
