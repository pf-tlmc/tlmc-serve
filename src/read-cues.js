const path = require('path')
const cueParser = require('cue-parser')
const { File, Directory } = require('ls-serialize')

/**
 * This may not be a full sanitization, but it is intended to mock foobar2000's
 * implementation just for the filenames included in the TLMC
 */
function sanitizeFilename (filename) {
  return filename.split('').map(char => {
    const replacement = SANITIZE_MAP[char]
    return replacement === undefined ? char : replacement
  }).join('')
}

const SANITIZE_MAP = {
  '/': '-',
  '\\': '-',
  '?': '',
  '*': 'x',
  ':': '-',
  '|': '-',
  '<': '_',
  '>': '_',
  '\t': '_'
}

module.exports = function readCues (root, rootPath) {
  const songs = []

  function _readCues (currFile, shortPath, shortDir) {
    if (currFile instanceof File && currFile.ext.toLowerCase() === '.cue') {
      const cue = cueParser.parse(rootPath + currFile.path)
      for (const file of cue.files) {
        for (const track of file.tracks) {
          const number = ('00' + track.number).slice(-2)
          const title = track.title || path.parse(file.name).name
          const filename = sanitizeFilename(`${number}. ${title}.mp3`)
          songs.push({
            path: path.join(shortDir, filename),
            cuePerformer: cue.performer,
            cueSongwriter: cue.songWriter,
            cueTitle: cue.title,
            number: track.number,
            title: track.title,
            performer: track.performer,
            songWriter: track.songWriter
          })
        }
      }
    } else if (currFile instanceof Directory) {
      Array.from(currFile.files).forEach((file, index) => {
        _readCues(file, path.join(shortPath, `${index}`), shortPath)
      })
    }
  }

  _readCues(root, '', '')
  return songs
}
