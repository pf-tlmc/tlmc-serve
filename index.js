const express = require('express')
const serveIndex = require('serve-index')
const compression = require('compression')

const TLMC_PATH = process.env.TLMC_PATH
const TLMC_SERVE_PORT = process.argv[2] || process.env.TLMC_SERVE_PORT

console.log(TLMC_PATH)

const app = express()

app.use(compression({ level: 9 }))

app.use('/tlmc', express.static(TLMC_PATH))
app.use('/tlmc', serveIndex(TLMC_PATH, {
  hidden: true,
  icons: true,
  view: 'details'
}))

app.use((request, response) => { response.sendStatus(404) })

app.listen(TLMC_SERVE_PORT, () => {
  console.log(`TLMC_SERVE started on port ${TLMC_SERVE_PORT}`)
})
