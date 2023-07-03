import agentSearch from '@routes/agent/search'
import agentsViewAll from '@routes/agent/view-all'

import baseApp from './base-app'
import { FastifyInstance } from 'fastify'

const buildAgentApp = (app: FastifyInstance) => {
  if (!app) return baseApp()

  const prefix = '/agents'
  // ROUTES
  app.register(agentSearch, { prefix })
  app.register(agentsViewAll, { prefix })

  return app
}

export default buildAgentApp
