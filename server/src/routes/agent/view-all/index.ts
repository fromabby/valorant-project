import { FastifyInstance, FastifyReply, FastifyServerOptions, HookHandlerDoneFunction } from "fastify"
import AgentsModel from "@models/Agents"

const viewAllRoute = (
  fastify: FastifyInstance, 
  _: FastifyServerOptions, 
  done: HookHandlerDoneFunction
) => {
  fastify.get('/all', async (_, reply: FastifyReply) => {
    const data = new AgentsModel().findAll()

    reply.send({
      success: true,
      data
    })
  })
  done()
}

export default viewAllRoute
