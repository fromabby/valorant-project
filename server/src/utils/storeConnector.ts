import axios from "axios"

class StoreConnector {
  playerId: string
  entitlementToken: string
  accessToken: string

  constructor() {
    this.playerId = ""
    this.entitlementToken = ""
    this.accessToken = ""
  }

  async getUser(entitlementToken: string, accessToken: string) {
    this.entitlementToken = entitlementToken
    this.accessToken = accessToken

    return await this._fetchStore()
  }

  private async _fetchStore() {
    await this._fetchPlayer()
    return axios.get(
      `https://pd.ap.a.pvp.net/store/v2/storefront/${this.playerId}`,
      {
        headers: {
          'X-Riot-Entitlements-JWT': this.entitlementToken,
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    ).then(res => {
      return {
        storeOffers: res.data['SkinsPanelLayout']['SingleItemOffers'],
        playerId: this.playerId
      }
    })
  }
  
  private async _fetchPlayer() {
    return axios.get(
      `https://auth.riotgames.com/userinfo`,
      {
        headers: {
          'X-Riot-Entitlements-JWT': this.entitlementToken,
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    ).then(res => {
      this.playerId = res.data.sub
      return this.playerId
    })
  }
}

export default StoreConnector
