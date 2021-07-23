![](https://github.com/c-sp/age-online/workflows/AGE%20Online%20CI/badge.svg)

[Try out AGE Online](https://c-sp.github.io/age-online)

# Another Gameboy Emulator - Online

AGE Online is based on
[AGE](https://github.com/c-sp/AGE) (written in C++ and compiled to
[WebAssembly](https://webassembly.org/) using
[Emscripten](https://emscripten.org)).
The AGE [PWA](https://en.wikipedia.org/wiki/Progressive_web_application)
is written in [TypeScript](https://www.typescriptlang.org/),
makes use of (among others) [Gatsby](https://www.gatsbyjs.com/) and
[React](https://reactjs.org/) and is localized with
[@shopify/react-i18n](https://www.npmjs.com/package/@shopify/react-i18n).

AGE Online is a work in progress. Current features:

* on-screen controls for use on mobile devices
* interface language adjustable
  (just english and german at the moment)
* savegames are stored by your browser
  (using the [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API))
* light and dark theme available via
  [Material UI](https://material-ui.com)
