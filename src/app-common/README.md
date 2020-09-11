# AGE Online static files

This package contains common AGE Online web application code and files.

Static files must be copied over to the directory the respective application
expects static files
(e.g. `<app>/static` for [Gatsby](https://www.gatsbyjs.com/),
`<app>/public` for [Next.js](https://nextjs.org/)).

## Favicon

The [Real Favicon Generator](https://realfavicongenerator.net/) website is used
to generate Favicons for different platforms from [icon.svg](icon.svg).

[Real Favicon Generator](https://realfavicongenerator.net/) options:
* **Favicon for iOS - Web Clip:**
  use `#ffffff` as solid, plain background to fill the transparent regions.
* **Favicon for Android Chrome:**
  use `#5050ff` as theme color.
* **macOS Safari:**
  turn the picture into a monochrome icon.
  Use `#5050ff` as theme color.
* **Favicon Generator Options:**
    * **Path:**
      use `/age-online/` as path.
    * **App name:**
      use "AGE Online" as app name.


## Fonts

All files required by AGE Online should be served from the same domain.
We thus self-host all used fonts:

* [Roboto](https://google-webfonts-helper.herokuapp.com/fonts/roboto?subsets=latin)
* [Roboto Condensed](https://google-webfonts-helper.herokuapp.com/fonts/roboto-condensed?subsets=latin)


## AGE Wasm

The AGE WebAssembly binary and JavaScript "loader module" are currently loaded
on-demand.
