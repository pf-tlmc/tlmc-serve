const app = require('./src/tlmc-serve')

const PORT = process.argv[2] || process.env.TLMC_SERVE_PORT || 3000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
