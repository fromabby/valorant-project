import buildDevApp from "./app.js"

const NODE_ENV = 'development'

if (NODE_ENV === 'development') {
  const app = buildDevApp()

  app.listen({ port: 3000 }, async (error, address) => {
    if (error) {
      console.log(error)
      process.exit(1)
    }

    console.log(`Server listening at ${address}`)
  })
}
