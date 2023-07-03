import { FastifyInstance } from 'fastify'
import authRoute from '@routes/auth/index'

import baseApp from './base-app'

const buildAgentApp = (app: FastifyInstance | null) => {
  if (!app) return baseApp()

  app.register(authRoute)

  return app
}

export default buildAgentApp
