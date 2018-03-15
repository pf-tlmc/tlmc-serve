const path = require('path')
const express = require('express')
const compression = require('compression')

const PATHS = {
  tlmc: process.env.TLMC_PATH,
  lsCache: path.resolve(__dirname, './cache/ls.cache'),
  cueCache: path.resolve(__dirname, './cache/cue.cache')
}

for (const key in PATHS) {
  if (!PATHS[key]) {
    console.error(`Path \`${key}\` was not specified.`)
    process.exit(1)
  }
}

require('./ls-cache')(PATHS)
require('./cue-cache')(PATHS)
require('./check-files')(PATHS)

// Create server
const app = express()

app.use((request, response, next) => {
  if (process.env.NODE_ENV === 'production' && request.ip !== '138.197.197.88') {
    return response.sendStatus(401)
  }
  next()
})

app.use(compression({ level: 9 }))
app.use('/tlmc', express.static(PATHS.tlmc))
app.get('/ls', (request, response) => { response.sendFile(PATHS.lsCache) })
app.get('/cue', (request, response) => { response.sendFile(PATHS.cueCache) })

app.use((request, response) => { response.sendStatus(404) })

module.exports = app
