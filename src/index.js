var fs = require('fs')

var replaceExt = require('replace-ext')
const chalk = require('chalk')

//  This readSvgFiles function is probably available as an NPM package...
const readSvgFiles = require('./helpers/readSvgFiles.js')
export const reformatFigmaSvg = require('./helpers/reformatFigmaSvg.js')

//  This is a script to make any SVGs available as modules that export an SVG string.
//  This allows us to inline our SVG and take advantage of CSS styling of said inlined SVGs.
//  It also reformats SVGs exported from Figma, which otherwise would be unsuitable for inline use.
//
//  An alternative approach might be to mess with create-react-app's webpack loader config,
//  which by default imports .svgs as filepaths for use in `src` attributes,
//  to try to make it import .svgs as flat strings.
//  However, this seems a bit hacky unless we eject from create-react-app, which seems a bit scary.
//  And, it won't fix the Figma export issues
function handleSvgFile(dirname, filename, content) {
  const svgString = reformatFigmaSvg(content)
  //  Strip newlines to prevent JS errors
  const strippedNewlines = svgString.replace(/\n/g, '')
  //  Write contents as JS module
  const jsContents = `export default '${strippedNewlines}'`
  const jsFilename = replaceExt(filename, '.js')
  fs.writeFileSync(dirname + jsFilename, jsContents)
  //  Celebrate!
  let message = chalk.green('✔')
  message += ' Converted SVG file: '
  message += chalk.green(jsFilename)
  console.log(message)
}

function handleSvgFileCount(dirname, count) {
  if (count === 0) {
    console.log(
      chalk.keyword('orange')('No SVG files were found in ' + dirname + ' !')
    )
  } else {
    console.log(chalk.italic.gray('Found ' + count + ' SVG files ...'))
  }
}

function handleCompletion() {
  console.log('')
}

function handleError(err) {
  console.log(chalk.red('ERR! '))
  console.log(chalk.red(err))
}

module.exports = function convertFigmaSvgsForReact(directory) {
  console.log(chalk.italic.gray('Searching ' + directory + ' ...'))
  readSvgFiles(
    directory,
    handleSvgFileCount,
    handleSvgFile,
    handleCompletion,
    handleError
  )
}
