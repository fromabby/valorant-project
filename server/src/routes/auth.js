import ValorantService from "../services/ValorantService.js"

const getStore = (fastify, options, done) =>
  fastify.post('/login', async (req, reply) => {
    const { username, password } = req.body
    try {
      const valorantService = new ValorantService(username, password)

      const {
        playerId,
        skins
      } = await valorantService.initializeUser()

      reply.send({
        success: true,
        playerId: playerId,
        store: skins
      })
    } catch (error) {
      reply.send({
        success: false,
        message: error.response.data
      })
    }
  })

const authRoutes = (fastify, options, done) => {
  getStore(fastify, options, done),

    done()
}

export default authRoutes
