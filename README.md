# ECC-GUI



## Install

* **Note: requires a node version >= 6 and an npm version >= 3.**
* **If you have installation or compilation issues with this project, please see [our debugging guide](https://github.com/chentsulin/electron-react-boilerplate/issues/400)**




**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn) for some reason, try `npm install`.

## Yarn Install (Debian/Ubuntu example)

```bash
$ sudo apt-get install yarn
$ npm yarn init
$ npm yarn install
```

## Run

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a server sends hot updates to the renderer process:

```bash
$ npm run dev
```

You Run these two commands __simultaneously__ in different console tabs:

```bash
$ npm run hot-updates-server
$ npm run start-hot-renderer
```



## Further commands

To run the application without packaging run

```bash
$ npm run build
$ npm start
```

To run End-to-End Test

```bash
$ npm run build
$ npm run test-e2e
```

