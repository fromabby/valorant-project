import AgentsModel from "../../../models/Agents.js"

const viewAllRoute = (fastify, options, done) => {
  fastify.get('/all', async (req, reply) => {
    const data = new AgentsModel().findAll()

    reply.send({
      success: true,
      data
    })
  })
  done()
}

export default viewAllRoute
