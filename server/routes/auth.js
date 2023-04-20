const ids = require("../ids")

const getStore = (fastify, options, done) => 
  fastify.post('/login', async (req, reply) => {
    const URL = `https://auth.riotgames.com/api/v1/authorization`

    const { username, password } = req.body
    try {
      // get cookie
      const { headers } = await fastify.axios.valorantApi.post(
        URL,
        {
          "client_id": "play-valorant-web-prod",
          "nonce": "1",
          "redirect_uri": "https://playvalorant.com/opt_in",
          "response_type": "token id_token",
          "scope": "account openid"
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const authCookies = headers['set-cookie']
      
      // login
      const loginResponse = await fastify.axios.valorantApi.put(
        URL,
        {
          "type": "auth",
          username,
          password,
          "remember": false,
          "language": "en_US"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Cookie: authCookies
          },
        }
      )

      if(loginResponse.data.error === 'auth_failure') {
        throw new Object({
          response: {
            data: "Invalid Credentials"
          }
        })
        return
      }

      const uri = loginResponse.data.response.parameters && loginResponse.data.response.parameters.uri
      
      const accessToken = uri.split('&')[0].split('https://playvalorant.com/opt_in#access_token=')[1]

      const entitlementResponse = await fastify.axios.valorantApi.post(
        `https://entitlements.auth.riotgames.com/api/token/v1`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      const entitlementToken = entitlementResponse.data.entitlements_token

      const { data: { sub: playerId }} = await fastify.axios.valorantApi.get(
        `https://auth.riotgames.com/userinfo`,
        {
          headers: {
            'X-Riot-Entitlements-JWT': entitlementToken,
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      const storeResponse = await fastify.axios.valorantApi.get(
        `https://pd.ap.a.pvp.net/store/v2/storefront/${playerId}`,
        {
          headers: {
            'X-Riot-Entitlements-JWT': entitlementToken,
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      const storeOffers = storeResponse.data['SkinsPanelLayout']['SingleItemOffers']
      
      const names = []
      storeOffers.map(offer => {
        const skin = ids.skinLevels.find(x => x.id.toLowerCase() === offer)
        names.push(skin ? skin.name : '')
      })

      reply.send({
        success: true,
        playerId: playerId,
        store: names
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

module.exports = authRoutes