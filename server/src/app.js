import baseApp from './base-app.js'
import buildAuthApp from './auth-app.js'
import buildAgentApp from './agents-app.js'

export const buildDevApp = (opts = {}) => {
  let app = baseApp(opts)
  app = buildAuthApp(app)
  app = buildAgentApp(app)

  return app
}

export default buildDevApp
