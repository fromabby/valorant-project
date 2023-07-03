import AGENTS from "@constants/agents"
import { ValorantDataType, ValorantItemType } from "@customTypes/valorant"

class Agents {
  findAll(): ValorantDataType {
    return AGENTS
  }

  findByName(searchTerm: string): ValorantItemType {
    const data = AGENTS.filter(({ name }) => name.toLowerCase() === searchTerm.toLowerCase())
    return data[0]
  }

  findById(searchId: string): ValorantItemType {
    const data = AGENTS.filter(({ id }) => id === searchId)

    return data[0]
  }
}

export default Agents
