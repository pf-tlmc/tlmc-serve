const fs = require('fs')
const { serialize } = require('ls-serialize')

function lsCache (paths) {
  try {
    fs.accessSync(paths.lsCache)
    console.log(`ls-cache: Existing cache found at ${paths.lsCache}`)
  } catch (error) {
    console.log('ls-cache: Creating directory structure...')
    fs.writeFileSync(paths.lsCache, serialize(paths.tlmc))
    console.log(`ls-cache: Cache created at ${paths.lsCache}`)
  }
}

module.exports = lsCache
