#!/usr/bin/env node
var convertFigmaSvgsForReact = require('../index.js')
var path = require('path')

var args = process.argv.slice(2)
console.log('Args...')
console.log(JSON.stringify(process.argv, null, 2))
var directory = path.resolve(__dirname + '/' + args[0]) + '/'

convertFigmaSvgsForReact(directory)
