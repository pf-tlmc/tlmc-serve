const path = require('path')
const express = require('express')
const compression = require('compression')

const PATHS = {
  tlmc: process.env.TLMC_PATH || 'F:\\Touhou lossless music collection',
  lsCache: path.resolve(__dirname, '../cache/ls.cache')
}

require('./ls-cache')(PATHS)

// Create server
const app = express()

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.ip !== '138.197.197.88') {
    return res.sendStatus(401)
  }
  next()
})

app.use(compression({ level: 9 }))
app.use('/tlmc', express.static(PATHS.tlmc))
app.get('/ls', (req, res) => { res.sendFile(PATHS.lsCache) })

app.use((req, res) => { res.sendStatus(404) })

module.exports = app
