const path = require('path')
const fs = require('fs')
const { deserialize } = require('ls-serialize')
const csvParse = require('csv-parse/lib/sync')

function checkFiles (paths) {
  console.log('check-files: Reading ls-cache...')
  const directory = deserialize(fs.readFileSync(paths.lsCache).toString())

  console.log('check-files: Reading cue-cache...')
  const songs = csvParse(fs.readFileSync(paths.cueCache).toString(), { columns: true })

  console.log(`check-files: Checking files...`)
  let failed = songs.filter(song => {
    let parts = song.path.split(path.sep)
    for (let index = 0, currDir = directory; index < parts.length - 1; ++index) {
      currDir = Array.from(currDir.files)[parts[index]]
      parts[index] = currDir.base
    }

    try {
      fs.accessSync(path.join(paths.tlmc, ...parts))
      return false
    } catch (error) {
      console.error(`check-files: - ${path.join(...parts)}`)
      return true
    }
  })

  if (failed.length) {
    console.error(`check-files: ${failed.length} songs not found.`)
  } else {
    console.log('check-files: All OK!')
  }
}

module.exports = checkFiles
