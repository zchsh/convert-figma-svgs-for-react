#!/usr/bin/env node
var convertFigmaSvgsForReact = require('../index.js')
var path = require('path')

var args = process.argv.slice(2)
var directory = args[0]
if (directory[directory.length - 1] !== '/') {
  directory += '/'
}

convertFigmaSvgsForReact(directory)
