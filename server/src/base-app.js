import fastify from "fastify"
import fastifyCors from '@fastify/cors'

const buildServer = (opts = {}) => {
  const app = fastify(opts)

  app.register(fastifyCors, {})

  return app
}

export default buildServer
