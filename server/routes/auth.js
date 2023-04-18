const getProfile = (fastify, options, done) => {
  fastify.post('/profile', async (req, reply) => {
    const { gameName, tagLine } = req.body || {}

    if (!gameName || !tagLine) {
      reply.send({ status: 200, data: {
        message: `${!gameName ? 'Game name' : ''}${!gameName && !tagLine ? ' and ' : ''}${!tagLine ? 'Tag line' : ''} required`
      }})
      return
    }
    try {
      const response = await fastify.axios.auth.get(`/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`)
      
      
      reply.send(response.data)
    } catch (error) {
      reply.send({ status: 200, data: error.response.data })
    }
  })
}

const getChromas = (fastify, options, done) => {
  fastify.get('/content', async (req, reply) => {
    try {
      const response = await fastify.axios.content.get(`/val/content/v1/contents?locale=en-US`)
      
      reply.send(response.data.chromas)
    } catch (error) {
      reply.send({ status: 200, data: error.response.data })
    }
  })
}

const authRoutes = (fastify, options, done) => {
  getProfile(fastify, options, done),
  getChromas(fastify, options, done),
  done()
}

module.exports = authRoutes