import AgentsModel from "../../../models/Agents.js"

const agentRoutes = (fastify, options, done) => {
  fastify.get('/', async (req, reply) => {
    const { name, id } = req.query
    if (name) {
      const data = new AgentsModel().findByName(name)

      reply.send({
        success: true,
        data
      })
    } else {
      const data = new AgentsModel().findById(id)

      reply.send({
        success: true,
        data
      })
    }
  })
  done()
}

export default agentRoutes
