import login from './routes/auth.js'

import baseApp from './base-app.js'

const buildAgentApp = (app) => {
  if (!app) return baseApp()

  app.register(login)

  return app
}

export default buildAgentApp
