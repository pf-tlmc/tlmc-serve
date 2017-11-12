const app = require('./src/tlmc-serve')

const PORT = process.argv[2] || process.env.TLMC_PORT || 80

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
