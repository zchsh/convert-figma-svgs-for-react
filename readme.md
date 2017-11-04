## Overview

A stopgap script for a very specific use case - having exported `.svg` files from Figma, I want to make them available as `.js` modules that just export the `<svg>` as a String, so that I can use it inline in `create-react-app` with `dangerouslySetInnerHTML`.

Searches the directory supplied as the first command-line argument for `.svg` files to convert to `.js` files, which are named identically and placed in the same directory. *Not* a recursive search, only parses `.svg` files right in the specified directory.

## Usage

```
convert-figma-svgs-for-react ./path/to/svg/directory
```
