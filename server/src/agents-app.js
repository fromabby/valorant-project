import agentSearch from './routes/agent/search/index.js'
import agentsViewAll from './routes/agent/view-all/index.js'

import baseApp from './base-app.js'

const buildAgentApp = (app) => {
  if (!app) return baseApp()

  const prefix = '/agents'
  // ROUTES
  app.register(agentSearch, { prefix })
  app.register(agentsViewAll, { prefix })

  return app
}

export default buildAgentApp
