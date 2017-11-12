const { sep, join } = require('path')
const { accessSync, readFileSync } = require('fs')
const { deserialize } = require('ls-serialize')
const csvParse = require('csv-parse/lib/sync')

function checkFiles (tlmcPath, lsCachePath, cueCachePath) {
  console.log('check-files: Reading ls-cache...')
  const directory = deserialize(readFileSync(lsCachePath).toString())

  console.log('check-files: Reading cue-cache...')
  const songs = csvParse(readFileSync(cueCachePath).toString(), { columns: true })

  console.log(`check-files: Checking files...`)
  let failed = songs.filter(song => {
    let parts = song.path.split(sep)
    for (let index = 0, currDir = directory; index < parts.length - 1; ++index) {
      currDir = Array.from(currDir.files)[parts[index]]
      parts[index] = currDir.base
    }

    try {
      accessSync(join(tlmcPath, ...parts))
      return false
    } catch (_) {
      console.log(`check-files: - ${join(...parts)}`)
      return true
    }
  })

  if (failed.length) {
    console.log(`check-files: ${failed.length} songs not found.`)
  } else {
    console.log('check-files: All OK!')
  }
}

module.exports = checkFiles
