const app = require('./app')

app.listen({ port: 3000 }, async (error, address) => {
  if(error) {
    console.log(error)
    process.exit(1)
  }

  console.log(`Server listening at ${address}`)
})
