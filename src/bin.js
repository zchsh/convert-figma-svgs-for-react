#!/usr/bin/env node
const convertFigmaSvgsForReact = require('./index.js')

const args = process.argv.slice(2)
console.log('Args...')
console.log(JSON.stringify(process.argv, null, 2))
const directory = args[0]

convertFigmaSvgsForReact(directory)
