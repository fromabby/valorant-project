import AGENTS from "../constants/agents.js"

class Agents {
  findAll() {
    return AGENTS
  }

  findByName(searchTerm) {
    const data = AGENTS.filter(({ name }) => name.toLowerCase() === searchTerm.toLowerCase())
    return data
  }

  findById(searchId) {
    const data = AGENTS.filter(({ id }) => id === searchId)

    return data
  }
}

export default Agents
