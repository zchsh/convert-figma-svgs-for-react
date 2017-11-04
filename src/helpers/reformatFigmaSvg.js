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
//  Finally, Figma also applies a transform to a wrapping #Canvas SVG group,
//  we need to preserve that transform by wrapping our parsed SVG elements
//  in the #Canvas group
//
//  This function uses `jsdom` to try to correct all of those issues.
function reformatFigmaSvg(figmaSvg) {
  //  Initialize JSDOM on the SVG document
  var dom = new JSDOM(figmaSvg)
  var svgDocument = dom.window.document
  //  Gather the actual SVG elements (eg <path>s) from <defs>
  var defs = svgDocument.querySelector('defs')
  var svgElements = defs.children
  //  For each SVG element, get the associated <use>,
  //  and apply all attributes of the <use> instance to the actual SVG element
  Array.from(svgElements).forEach(element => {
    const thisId = element.id
    const thisElement = svgDocument.querySelector('#' + thisId)
    const thisUse = svgDocument.querySelector(
      'use[xlink:href="#' + thisId + '"]'
    )
    //  Transfer all attributes (if any) from the <use> to the element
    if (thisUse.hasAttributes()) {
      var attrs = thisUse.attributes
      for (var i = attrs.length - 1; i >= 0; i--) {
        //  Exclude 'xlink:href' though, as it's only used to reference the <def>
        if (attrs[i].name !== 'xlink:href') {
          thisElement.setAttribute(attrs[i].name, attrs[i].value)
        }
      }
    }
  })
  //  Preserve the #Canvas transform by wrapping our SVG elements
  //  (which were modified in place inside the <defs> element)
  var canvas = svgDocument.querySelector('#Canvas')
  canvas.innerHTML = defs.innerHTML
  const shapes = canvas.outerHTML
  //  Preserve the <title> and <desc>, if available
  const titleElement = svgDocument.querySelector('title')
  const title = titleElement ? titleElement.outerHTML : ''
  const descElement = svgDocument.querySelector('desc')
  const desc = descElement ? descElement.outerHTML : ''
  //  Assemble the parsed SVG contents
  const parsedContents = title + desc + shapes
  //  We also need to wrap everything in the original <svg> parent element
  var svgWrapper = svgDocument.querySelector('svg')
  svgWrapper.innerHTML = parsedContents
  //  Finally, we return our formatted SVG as a string
  return svgWrapper.outerHTML
}

module.exports = reformatFigmaSvg
