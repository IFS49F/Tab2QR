# Tab2QR

Available for [Firefox](https://addons.mozilla.org/firefox/addon/tab2qr/) and [Chrome](https://chrome.google.com/webstore/detail/tab2qr/mkfcgekjddmlceifimndhbliepfgnogo)

A minimalist browser extension to send the page you are currently viewing to your mobile device.

## Usage Notes

The extension manifest is defined in `src/manifest.ts` and used by `@samrum/vite-plugin-web-extension` in the vite config.

Popup entry point is in the `src/entries/popup` directory.

To switch between Manifest V2 and Manifest V3 builds, use the MANIFEST_VERSION environment variable defined in `.env`

HMR during development in Manifest V3 requires Chromium version >= 110.0.5480.0.

Refer to [@samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension) for more usage notes.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

This project uses [Yarn Zero-Install](https://yarnpkg.com/features/zero-installs) so no dependency installation is required.

## Commands

### Build

#### Development, HMR

Hot Module Reloading is used to load changes inline without requiring extension rebuilds and extension/page reloads

```sh
yarn dev
```

#### Development, Watch

Rebuilds extension on file changes. Requires a reload of the extension (and page reload if using content scripts)

```sh
yarn watch
```

#### Production

Minifies and optimizes extension build

```sh
yarn build
```

### Load extension in browser

Loads the contents of the dist directory into the specified browser

```sh
yarn serve:chromium
```

```sh
yarn serve:firefox
```

### Package extension into .zip file

```sh
yarn package
```

## License

MIT

Icons by [Freepiks](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](http://www.flaticon.com/)
