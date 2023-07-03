import { FastifyInstance, FastifyReply, FastifyServerOptions, HookHandlerDoneFunction } from "fastify"

import Skins from "@models/Skins"
import ValorantService from "@services/ValorantService"
import { CustomFastifyPostRequest } from "@customTypes/fastify_types"

type LoginPayload = {
  username: string
  password: string
}

const authRoutes = (
  fastify: FastifyInstance, 
  _: FastifyServerOptions, 
  done: HookHandlerDoneFunction
) => {
  fastify.post('/login', async (
    req: CustomFastifyPostRequest<LoginPayload>, 
    reply: FastifyReply
  ) => {
    const { username, password } = req.body
    try {
      const valorant = new ValorantService(username, password)

      const { storeOffers } = await valorant.initializeUser()

      const skins = new Skins().findStoreItems(storeOffers)

      reply.send({
        success: true,
        store: skins
      })
    } catch (error) {
      reply.send({
        success: false,
        message: (error as Error).message
      })
    }
  })
  done()
}

export default authRoutes
