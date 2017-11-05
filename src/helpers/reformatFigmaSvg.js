const { JSDOM } = require('jsdom')

//  Figma exports with <use>, which pulls elements from a <defs> parent
//  rather than just exporting straight SVG elements (such as <path>)
//  ... but the <use>s reference simple IDs like "path0_fill", which
//  are duplicated across included files, so pieces of the first inlined SVG file
//  end up being <use>d in subsequent inlined SVG files, overriding those
//  with duplicate IDs, resulting in totally unexpected behaviour.
//
//  To complicate things further, Figma applies CSS transforms and fill colors
//  to each <use>, so we can't just pull out the SVG elements in <defs>...
//  for this reason, we have to duplicate all attributes from each <use> in a
//  file onto the corresponding SVG element within <defs>
//
//  This function uses `jsdom` to try to correct all of those issues
//  by replacing each <use> with the path it references, and copying over
//  all attributes from each specific <use> to the clone of the path
//  that replaces it
function reformatFigmaSvg(figmaSvg) {
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
