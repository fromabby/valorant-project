import axios from "axios"

type StoreResponse = [string, string, string, string]
type LoginResponse = {
  response: {
    parameters: {
      uri: string
    }
  }
}
interface ValorantServiceResponse {
  storeOffers: StoreResponse
  playerId: string
}


class ValorantService {
  cookies: string[]
  accessToken: string
  uri: string
  entitlementToken: string
  username: string
  password: string
  playerId: string

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
    this.cookies = []
    this.accessToken = ""
    this.entitlementToken = ""
    this.uri = ""
    this.playerId = ""
  }

  async initializeUser(): Promise<ValorantServiceResponse> {
    this.cookies = await this.getCookie()
    const { response } = await this.login()

    this.accessToken = response.parameters.uri.split('&')[0].split('https://playvalorant.com/opt_in#access_token=')[1]

    await this.getEntitlement()
    await this.getUserInfo()
    const storeOffers = await this.getStore()

    return {
      storeOffers,
      playerId: this.playerId
    }
  }
  
  private async getCookie(): Promise<string[]> {
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

    return headers['set-cookie'] || []
  }

  private async login(): Promise<LoginResponse> {
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
      throw new Error("Invalid Credentials")
    }

    return response.data
  }

  private async getEntitlement(): Promise<void> {
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

  private async getUserInfo(): Promise<void> {
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

  private async getStore(): Promise<StoreResponse> {
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

    return storeOffers
  }
}

export default ValorantService
