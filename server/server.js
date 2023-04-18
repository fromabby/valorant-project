import Fastify from 'fastify'
import cors from '@fastify/cors'
import axios from 'fastify-axios'

const fastify = Fastify()

await fastify.register(cors, { 
  // put your options here
})
await fastify.register(axios)

const AUTH_ENDPOINT = `https://auth.riotgames.com/api/v1/authorization`

fastify.get('/', async (req, reply) => {
  try {
    // const response = await fastify.axios.post(
    //   AUTH_ENDPOINT,
    //   {
    //     client_id: 'play-valorant-web-prod',
    //     nonce: '1',
    //     redirect_uri: 'https://playvalorant.com/opt_in',
    //     response_type: 'token id_token',
    //     scope: 'account openid'
    //   },
    //   {
    //     headers: {
    //       Cookie: ssid_cookie,
    //       'User-Agent': 'RiotClient/43.0.1.4195386.4190634 rso-auth (Windows; 10;;Professional, x64)'
    //     },
    //   }
    // )
  
    const response = await fastify.axios.get('https://valorant-api.com/v1/weapons')
    
    const weaponId = response.data.data[0].uuid
    
    reply.send({ data: weaponId })
  } catch (error) {
    reply.send({ status: 200, data: error.response.data })
  }
})

fastify.listen({ port: 3000 }, async (error, address) => {
  if(error) {
    console.log(error)
    process.exit(1)
  }

  console.log(`Server listening at ${address}`)
})
