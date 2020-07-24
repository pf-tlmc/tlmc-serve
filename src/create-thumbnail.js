const sharp = require('sharp')

function createThumbnail (path) {
  const img = sharp(path)
  return img
    .metadata()
    .then(({ width, height }) => {
      const isWide = width >= height * 1.5
      const size = Math.min(isWide ? width >> 1 : width, height)
      return img
        .extract({
          left: ((isWide ? width * 2 : width) - size) >> 1,
          top: (height - size) >> 1,
          width: size,
          height: size
        })
        .resize(256, 256)
        .toBuffer()
    })
}

module.exports = createThumbnail
