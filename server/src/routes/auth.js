import ValorantService from "../services/ValorantService.js"

const authRoutes = (fastify, options, done) => {
  fastify.post('/login', async (req, reply) => {
    const { username, password } = req.body
    try {
      const valorant = new ValorantService(username, password)

      const { skins } = await valorant.initializeUser()

      reply.send({
        success: true,
        store: skins
      })
    } catch (error) {
      reply.send({
        success: false,
        message: error.response.data
      })
    }
  })
  done()
}

export default authRoutes
