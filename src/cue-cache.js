const { accessSync, readFileSync, writeFileSync } = require('fs')
const { ls, deserialize } = require('ls-serialize')
const csvStringify = require('csv-stringify/lib/sync')
const readCues = require('./read-cues')

function cueCache (tlmcPath, lsCachePath, cueCachePath) {
  try {
    accessSync(cueCachePath)
    console.log(`cue-cache: Existing cache found at ${cueCachePath}`)
  } catch (_) {
    let directory

    if (lsCachePath) {
      try {
        accessSync(lsCachePath)
        console.log(`cue-cache: Using ls-cache at ${lsCachePath}`)
        directory = deserialize(readFileSync(lsCachePath).toString())
      } catch (_) {
        console.log(`cue-cache: No ls-cache found at ${lsCachePath}`)
      }
    }

    if (!directory) {
      console.log('cue-cache: Creating directory structure...')
      directory = ls(tlmcPath)
    }

    console.log('cue-cache: Parsing cue files...')
    const cueCsv = csvStringify(readCues(directory, tlmcPath), { header: true })
    writeFileSync(cueCachePath, cueCsv)
    console.log(`cue-cache: Cache created at ${cueCachePath}`)
  }
}

module.exports = cueCache
