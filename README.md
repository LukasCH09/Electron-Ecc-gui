# Electron-Ecc-gui
This is the electron GUI alternative to the traditional in wallet gui for E-Currency Coin

## Installation

  1. Clone this repo into your development environment.
  1. Run `yarn` or `npm install` within the cloned directory to install the dependencies.
  1. Run `yarn build` or `npm run build` to compile the source.

## Running the application

  Run `yarn start` or `npm start` within the cloned directory to start the application.

## development

  Running `yarn dev` or `npm run dev` will compile the files under `src/`, as well as watch them for changes and rebuild them automatically. When the dev tools are open in the application `CMD + R` can be used to reload it. So the optimal workflow looks something like this:

  1) Ensure the devtools are enabled in `index.js`.
  1) Open to command line tabs, in one run `yarn dev`, and in the other run `yarn start`.
  1) Make changes to the source, and save them.
  1) When the application has focus press `CMD + R` to reload it and see your changes reflected.
