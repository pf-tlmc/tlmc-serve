const sharp = require('sharp')

function createThumbnail (path) {
  const img = sharp(path)
  return img
    .metadata()
    .then(({ width, height }) => {
      const isWide = width >= height * 1.5
      const isTall = height >= width * 1.5
      const size = Math.min(isWide ? width >> 1 : width, isTall ? height >> 1 : height)
      return img
        .extract({
          left: ((isWide ? width * 1.5 : width) - size) >> 1,
          top: ((isTall ? height * 1.5 : height) - size) >> 1,
          width: size,
          height: size
        })
        .resize(200, 200)
        .toBuffer()
    })
}

module.exports = createThumbnail
