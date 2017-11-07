## Overview

A stopgap script for a very specific use case - having exported `.svg` files from Figma, I want to make them available as `.js` modules that just export the `<svg>` as a String, so that I can use it inline in `create-react-app` with `dangerouslySetInnerHTML`.

Searches the directory supplied as the first command-line argument for `.svg` files to convert to `.js` files, which are named identically and placed in the same directory. *Not* a recursive search, only parses `.svg` files right in the specified directory.

## Usage

```
convert-figma-svgs-for-react ./path/to/svg/directory
```

If you just want to use the function that cleans up an SVG exported from Figma, so that it doesn't use `<defs>` and `<use>`, you can also

```javascript
var reformatFigmaSvg = require('convert-figma-svgs-for-react').reformatFigmaSvg
//  or
import { reformatFigmaSvg } from 'convert-figma-svgs-for-react'
```
