import { SKIN_LEVELS } from "@constants/skins"
import { ValorantDataType, ValorantItemType } from "@customTypes/valorant"

type StoreOffer = [string, string, string, string]

class Skins {
  findAll(): ValorantDataType {
    return SKIN_LEVELS
  }

  findByName(searchTerm: string): ValorantItemType {
    const data = SKIN_LEVELS.filter(({ name }) => name.toLowerCase() === searchTerm.toLowerCase())
    return data[0]
  }

  findById(searchId: string): ValorantItemType {
    const data = SKIN_LEVELS.filter(({ id }) => id === searchId)

    return data[0]
  }

  findStoreItems(storeOffers: StoreOffer): string[] {
    const names: string[] = []

    storeOffers.map(offer => {
      const skin = SKIN_LEVELS.find(x => x.id.toLowerCase() === offer)
      names.push(skin ? skin.name : '')
    })

    return names
  }
}

export default Skins
