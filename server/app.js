const fastify = require('fastify')()

const cors = require('@fastify/cors')
const axios = require('fastify-axios')
const fastifyEnv = require('@fastify/env')
const fastifyCookie = require('@fastify/cookie')

// env config
const schema = {
  type: 'object',
  required: ['PORT', 'DEVELOPMENT_API_KEY', 'RIOT_AUTH_URL', 'RIOT_CONTENT_URL'],
  properties: {
    PORT: { type: 'string' },
    DEVELOPMENT_API_KEY: { type: 'string' },
    RIOT_AUTH_URL: { type: 'string' },
    RIOT_CONTENT_URL: { type: 'string' }
  }
}

const options = {
  confKey: 'env',
  schema: schema,
  data: process.env,
  dotenv: {
    path: `${__dirname}/.env`,
    debug: true
  }
}
fastify.register(fastifyEnv, options).after(() => {
  fastify.register(axios, {
    clients: {
      auth: {
        baseURL: fastify.env.RIOT_AUTH_URL,
        headers: {
          'X-Riot-Token': fastify.env.DEVELOPMENT_API_KEY
        }
      },
      content: {
        baseURL: fastify.env.RIOT_CONTENT_URL,
        headers: {
          'X-Riot-Token': fastify.env.DEVELOPMENT_API_KEY
        }
      },
      valorantApi: {
        baseURL: ''
      }
    }
  })
})

fastify.register(cors, {})

fastify.register(fastifyCookie, {
  secret: "my-secret", // for cookies signature
  hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {}  // options for parsing cookies
})

// routes
const authRoute = require('./routes/auth.js')

fastify.register(authRoute)

module.exports = fastify