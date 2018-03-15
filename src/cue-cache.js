const fs = require('fs')
const { ls, deserialize } = require('ls-serialize')
const csvStringify = require('csv-stringify/lib/sync')
const readCues = require('./read-cues')

function cueCache (paths) {
  try {
    fs.accessSync(paths.cueCache)
    console.log(`cue-cache: Existing cache found at ${paths.cueCache}`)
  } catch (error) {
    let directory

    if (paths.lsCache) {
      try {
        fs.accessSync(paths.lsCache)
        console.log(`cue-cache: Using ls-cache at ${paths.lsCache}`)
        directory = deserialize(fs.readFileSync(paths.lsCache).toString())
      } catch (error) {
        console.log(`cue-cache: No ls-cache found at ${paths.lsCache}`)
      }
    }

    if (!directory) {
      console.log('cue-cache: Creating directory structure...')
      directory = ls(paths.tlmc)
    }

    console.log('cue-cache: Parsing cue files...')
    const cueCsv = csvStringify(readCues(directory, paths.tlmc), { header: true })
    fs.writeFileSync(paths.cueCache, cueCsv)
    console.log(`cue-cache: Cache created at ${paths.cueCache}`)
  }
}

module.exports = cueCache
