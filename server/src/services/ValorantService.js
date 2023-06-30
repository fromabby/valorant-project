import VALORANT_IDS from "../constants/ids.js"
import axios from "axios"

class ValorantService {
  cookies
  accessToken
  uri
  entitlementToken
  username
  password
  playerId

  constructor(username, password) {
    this.username = username
    this.password = password
  }

  async getCookie() {
    const { headers } = await axios.post(
      `https://auth.riotgames.com/api/v1/authorization`,
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

    return headers['set-cookie']
  }

  async login() {
    const response = await axios.put(
      "https://auth.riotgames.com/api/v1/authorization",
      {
        "type": "auth",
        username: this.username,
        password: this.password,
        "remember": false,
        "language": "en_US"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: this.cookies
        },
      }
    )

    if (response.data.error === 'auth_failure') {
      throw new Object({
        response: {
          data: "Invalid Credentials"
        }
      })
    }

    return response.data
  }

  async initializeUser() {
    this.cookies = await this.getCookie()
    const { response } = await this.login()

    this.accessToken = response.parameters.uri.split('&')[0].split('https://playvalorant.com/opt_in#access_token=')[1]

    await this.getEntitlement()
    await this.getUserInfo()
    const skins = await this.getStore()

    return {
      skins,
      playerId: this.playerId
    }
  }

  async getEntitlement() {
    const { data } = await axios.post(
      `https://entitlements.auth.riotgames.com/api/token/v1`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    )

    this.entitlementToken = data.entitlements_token
  }

  async getUserInfo() {
    const { data: { sub: playerId } } = await axios.get(
      `https://auth.riotgames.com/userinfo`,
      {
        headers: {
          'X-Riot-Entitlements-JWT': this.entitlementToken,
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    )

    this.playerId = playerId
  }

  async getStore() {
    const storeResponse = await axios.get(
      `https://pd.ap.a.pvp.net/store/v2/storefront/${this.playerId}`,
      {
        headers: {
          'X-Riot-Entitlements-JWT': this.entitlementToken,
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    )

    const storeOffers = storeResponse.data['SkinsPanelLayout']['SingleItemOffers']

    const names = []
    storeOffers.map(offer => {
      const skin = VALORANT_IDS.skinLevels.find(x => x.id.toLowerCase() === offer)
      names.push(skin ? skin.name : '')
    })

    return names
  }
}

export default ValorantService
