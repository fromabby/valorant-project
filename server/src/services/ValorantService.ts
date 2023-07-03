import AuthorizationConnector from "@utils/authorizationConnector"
import StoreConnector from "@utils/storeConnector"
import axios from "axios"

type StoreResponse = [string, string, string, string]
type GetUserResult = {
  storeOffers: StoreResponse
  playerId: string
}
type LoginParameters = {
  parameters: {
    uri: string
  }
}
type LoginResponse = {
  response: LoginParameters
}
interface ValorantServiceResponse {
  storeOffers: StoreResponse
  playerId: string
}

class ValorantService {
  cookies: string[]
  accessToken: string
  entitlementToken: string
  username: string
  password: string
  playerId: string
  authConnector
  storeConnector

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
    this.cookies = []
    this.accessToken = ""
    this.entitlementToken = ""
    this.playerId = ""
    this.authConnector = new AuthorizationConnector()
    this.storeConnector = new StoreConnector()
  }

  async initializeUser(): Promise<ValorantServiceResponse> {
    const { response } = await this.login()
    
    this.accessToken = this._getAccessToken(response)
    
    await this._getEntitlement()
    const { playerId, storeOffers } = await this.getUserData()

    return {
      storeOffers,
      playerId
    }
  }

  private _getAccessToken(response: LoginParameters) {
    return response.parameters.uri.split('&')[0].split('https://playvalorant.com/opt_in#access_token=')[1]
  }

  private async login(): Promise<LoginResponse> {
    const response = await this.authConnector.login(this.username, this.password)

    if (response.data.error === 'auth_failure') {
      throw new Error("Invalid Credentials")
    }

    return response.data
  }

  private async _getEntitlement(): Promise<void> {
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

  private async getUserData(): Promise<GetUserResult> {
    const response = await this.storeConnector.getUser(this.entitlementToken, this.accessToken)

    return response
  }
}

export default ValorantService
