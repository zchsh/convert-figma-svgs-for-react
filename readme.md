## Overview

Not maintained with much intention - built for a very specific use case, with no
real testing. But I'll care more if someone else does, so definitely file an
issue if you this seems useful and something seems broken or missing.

Having exported `.svg` files from Figma, I want to make them available as `.js`
modules that just export the `<svg>` contents as a String, so that I can use
SVGs inline in `create-react-app` with `dangerouslySetInnerHTML`.

For command-line use, this script searches the directory supplied as the first
command-line argument for `*.svg` files to convert. The converted `.js` files
are named identically and placed in the same directory.

**It does NOT search sub-folders recursively** - it only parses `.svg` files
right in the specified directory.

## Usage

```shell
convert-figma-svgs-for-react ./path/to/svg/directory
```

It's probably convenient to set this up as a script in `package.json`, so you
can run it before builds, or conveniently use it with a watcher, or whatever.

```json
{
  "scripts": {
    "convert-svg": "convert-figma-svgs-for-react ./path/to/svg/directory"
  }
}
```

If you want to clean up an SVG string exported from Figma, (replacing `<use>`
with actual paths, and removing `<defs>`), you can also call the reformatting
function directly...

```javascript
var reformatFigmaSvg = require('convert-figma-svgs-for-react').reformatFigmaSvg
//  or
import { reformatFigmaSvg } from 'convert-figma-svgs-for-react'
```

## Configuration

You can set the `<title>` and `<desc>` of each converted SVG file by include a
`convert-figma-svg.config.json` file in the directory being converted:

```json
{
  "meta_tags": {
    "acme_logo": {
      "title": "Acme Logo",
      "desc": "The diamond-shaped logo of the Acme corporation."
    }
  }
}
```

Or, if calling the function directly on an SVG string,

```javascript
reformatFigmaSvg(mySvgString, {
  title: 'Acme Logo',
  desc: 'The diamond-shaped logo of the Acme corporation.'
})
```

If no configuration is provided, this script replaces the `<title>` with the
SVG's filename (or an empty string when using `reformatFigmaSvg` directly) and
the `<desc>` with an empty string.

Why? When exporting, Figma seems to set the `<title>` of the SVG to the name of
the exported group, and the `<desc>` to `Created using Figma`. Resetting the
description to an empty string helps avoid situations where `Created using
Figma` shows up in search results from SVGs embedded early on the page.
