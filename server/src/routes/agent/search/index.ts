import { FastifyInstance, FastifyReply, FastifyServerOptions, HookHandlerDoneFunction } from "fastify"
import AgentsModel from "@models/Agents"
import { CustomFastifyGetRequest } from "@customTypes/fastify_types"

interface SearchPayload {
  name: string
  id: string
}

const agentRoutes = (
  fastify: FastifyInstance, 
  _: FastifyServerOptions, 
  done: HookHandlerDoneFunction
) => {
  fastify.get('/', async (
    req: CustomFastifyGetRequest<SearchPayload>,
    reply: FastifyReply
  ) => {
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
