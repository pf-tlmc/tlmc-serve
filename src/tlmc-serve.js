const path = require('path')
const express = require('express')
const serveIndex = require('serve-index')
const compression = require('compression')
const mime = require('mime')
const createThumbnail = require('./create-thumbnail')

const PATHS = {
  tlmc: process.env.TLMC_PATH || 'F:\\Touhou lossless music collection',
  lsCache: path.resolve(__dirname, '../.cache/ls.cache'),
  cueCache: path.resolve(__dirname, '../.cache/cue.cache')
}
const IMAGE_REGEX = /^\.(jpe?g|png|bmp|tiff|gif)$/i

require('./ls-cache')(PATHS)
require('./cue-cache')(PATHS)

// Create server
const app = express()
app.use(compression({ level: 9 }))

app.use('/tlmc/**', async (req, res, next) => {
  const filePath = req.params[0]
  const ext = path.extname(filePath)
  if (IMAGE_REGEX.test(ext) && req.query.size === 'thumbnail') {
    try {
      const buffer = await createThumbnail(path.resolve(PATHS.tlmc, filePath))
      res.setHeader('Content-Type', mime.getType(filePath))
      res.send(buffer)
    } catch (_) {
      next()
    }
  } else {
    next()
  }
})

app.use('/tlmc', express.static(PATHS.tlmc), serveIndex(PATHS.tlmc, { icons: true }))

app.get('/ls', (req, res) => { res.sendFile(PATHS.lsCache) })

app.use((req, res) => { res.sendStatus(404) })

module.exports = app
