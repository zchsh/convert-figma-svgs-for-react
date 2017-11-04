var fs = require('fs')
var path = require('path')

function readSvgFiles(
  dirname,
  onFileCount,
  onFileContent,
  onCompletion,
  onError
) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err)
      return
    }
    const svgFilenames = filenames.filter(f => /svg/i.test(path.extname(f)))
    const count = svgFilenames.length
    onFileCount(dirname, count)
    svgFilenames.forEach(function(filename, index) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err)
          return
        }
        onFileContent(dirname, filename, content)
        if (index === count - 1) {
          onCompletion()
        }
      })
    })
  })
}

module.exports = readSvgFiles
