const fs = require('fs')
const path = require('path')
const { deserialize } = require('ls-serialize')

function cueCache (paths) {
  try {
    fs.accessSync(paths.cueCache)
    console.log(`cue-cache: Existing cache found at ${paths.cueCache}`)
  } catch (error) {
    console.log('cue-cache: Reading directory structure...')
    const root = deserialize(fs.readFileSync(paths.lsCache).toString())

    console.log('cue-cache: Collecting cue sheets...')
    const cueSheets = []
    ;(function collectCueSheets (directory = root) {
      for (const file of directory) {
        if (file.isDirectory) {
          collectCueSheets(file)
        } else if (file.ext.toLowerCase() === '.cue') {
          cueSheets.push(file)
        }
      }
    })()

    console.log('cue-cache: Writing to file...')
    fs.writeFileSync(paths.cueCache, cueSheets.map((cueFile) =>
      `${cueFile.path}\n` +
      fs.readFileSync(path.join(paths.tlmc, cueFile.path)).toString()
    ).join('===\n'))

    console.log(`cue-cache: Cache created at ${paths.cueCache}`)
  }
}

module.exports = cueCache
