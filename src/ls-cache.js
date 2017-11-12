const { accessSync, writeFileSync } = require('fs')
const { serialize } = require('ls-serialize')

function lsCache (tlmcPath, lsCachePath) {
  try {
    accessSync(lsCachePath)
    console.log(`ls-cache: Existing cache found at ${lsCachePath}`)
  } catch (_) {
    console.log('ls-cache: Creating directory structure...')
    writeFileSync(lsCachePath, serialize(tlmcPath))
    console.log(`ls-cache: Cache created at ${lsCachePath}`)
  }
}

module.exports = lsCache
