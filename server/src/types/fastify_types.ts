import { FastifyRequest } from "fastify/types/request"

export type CustomFastifyGetRequest<T> = FastifyRequest<{
  Querystring: T
}>

export type CustomFastifyPostRequest<T> = FastifyRequest<{
  Body: T
}>
