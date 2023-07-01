import { SKIN_LEVELS } from "../constants/skins.js"

class Skins {
  findAll() {
    return SKIN_LEVELS
  }

  findByName(searchTerm) {
    const data = SKIN_LEVELS.filter(({ name }) => name.toLowerCase() === searchTerm.toLowerCase())
    return data
  }

  findById(searchId) {
    const data = SKIN_LEVELS.filter(({ id }) => id === searchId)

    return data
  }

  findStoreItems(storeOffers) {
    const names = []

    storeOffers.map(offer => {
      const skin = SKIN_LEVELS.find(x => x.id.toLowerCase() === offer)
      names.push(skin ? skin.name : '')
    })

    return names
  }
}

export default Skins
