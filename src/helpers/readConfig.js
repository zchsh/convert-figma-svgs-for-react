var fs = require('fs')
var path = require('path')

function readConfig(filename, dirname, callback) {
  fs.readFile(dirname + filename, 'utf-8', function(err, content) {
    if (err) {
      callback(err, null)
      return
    }
    callback(null, content)
  })
}

module.exports = readConfig
