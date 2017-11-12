const path = require('path')
const express = require('express')
const compression = require('compression')

const TLMC_PATH = process.argv[3] || process.env.TLMC_PATH || '/mnt/TouhouBox/tlmc'
const LS_CACHE_PATH = path.join(__dirname, 'cache', 'ls.cache')
const CUE_CACHE_PATH = path.join(__dirname, 'cache', 'cue.cache')

require('./ls-cache')(TLMC_PATH, LS_CACHE_PATH)
require('./cue-cache')(TLMC_PATH, LS_CACHE_PATH, CUE_CACHE_PATH)
require('./check-files')(TLMC_PATH, LS_CACHE_PATH, CUE_CACHE_PATH)

// Create server
const app = express()

app.use((req, res, next) => {
  if (req.ip !== '138.197.197.88') {
    return res.sendStatus(401)
  }
  next()
})

app.use(compression({ level: 9 }))
app.use('/tlmc', express.static(TLMC_PATH))
app.get('/ls', (_, response) => response.sendFile(LS_CACHE_PATH))
app.get('/cue', (_, response) => response.sendFile(CUE_CACHE_PATH))

module.exports = app
