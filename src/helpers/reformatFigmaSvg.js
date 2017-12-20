const path = require('path')
const { JSDOM } = require('jsdom')

//  Figma exports with <use>, which pulls elements from <defs> by their ID,
//  rather than just exporting straight SVG elements (such as <path>)
//  ... but the <use>s reference non-unique IDs like "path0_fill", which
//  often show up in several included files. This means files included later
//  on a page end up grabbing definitions from the first included file,
//  resulting in a total mess of pieces of SVGs showing up in unexpected places.
//
//  Figma applies CSS transforms and fill colors to each <use>,
//  and each defined path may be <use>d more than once.
//
//  This function uses `jsdom` to try to correct all of those issues
//  by replacing each <use> with the path it references. It copies over
//  all attributes (such as transforms and fill colors) from each specific
//  <use> to the clone of the path that replaces it.
function reformatFigmaSvg(filename, figmaSvg, CONFIG) {
  //  Initialize JSDOM on the SVG document
  var dom = new JSDOM(figmaSvg)
  var svgDocument = dom.window.document
  //  Gather the <use>s that render the graphic
  const uses = svgDocument.querySelectorAll('use')
  //  Replace each <use> with the referenced <path>, cloning attributes
  Array.from(uses).forEach(use => {
    replaceUseWithPath(use, svgDocument)
  })
  //  Remove the <defs> as they are no longer needed
  var defs = svgDocument.querySelector('defs')
  defs.remove()
  //  Set the <title> and <desc> of the SVG
  const basename = path.basename(filename, path.extname(filename))
  const metaTags = (CONFIG.meta_tags && CONFIG.meta_tags[basename]) || false
  var title = svgDocument.querySelector('title')
  title.textContent = (metaTags && metaTags.title) || basename
  var desc = svgDocument.querySelector('desc')
  desc.textContent = (metaTags && metaTags.desc) || ''
  //  Return the reformatted SVG as a string
  return svgDocument.querySelector('svg').outerHTML
}

function replaceUseWithPath(use, svgDocument) {
  const id = use.getAttribute('xlink:href')
  //  Clone the corresponding path element
  const path = svgDocument.querySelector(id).cloneNode(true)
  //  Transfer all attributes (if any) from the <use> to the path element
  if (use.hasAttributes()) {
    var attrs = use.attributes
    for (var i = attrs.length - 1; i >= 0; i--) {
      //  Exclude 'xlink:href' though, as it's only used to reference the <def>
      if (attrs[i].name !== 'xlink:href') {
        path.setAttribute(attrs[i].name, attrs[i].value)
      }
    }
  }
  // Replace the <use> with a clone of the path element
  use.parentNode.insertBefore(path, use)
  use.remove()
  return use
}

module.exports = reformatFigmaSvg
