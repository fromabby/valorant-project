import axios from "axios"

class AuthorizationConnector {
  cookies: string[]
  url: string

  constructor() {
    this.cookies = []
    this.url = 'https://auth.riotgames.com/api/v1/authorization'
  }

  async login(username: string, password: string) {
    await this._setCookie()
    return axios.put(
      this.url,
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
          'Cookie': this.cookies
        },
      }
    )
  }

  private async _setCookie() {
    return axios.post(
      this.url,
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
    ).then(res => {
      this.cookies = res.headers['set-cookie'] || []
      return this.cookies
    })
  }

}

export default AuthorizationConnector
