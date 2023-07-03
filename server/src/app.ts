import { FastifyInstance } from 'fastify'
import baseApp from './base-app'
import buildAuthApp from './auth-app'
import buildAgentApp from './agents-app'

export const buildDevApp = (opts = {}): FastifyInstance => {
  let app = baseApp(opts)
  app = buildAuthApp(app)
  app = buildAgentApp(app)

  return app
}

export default buildDevApp
