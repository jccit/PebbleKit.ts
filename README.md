# PebbleKit.ts

A modern Pebble app boilerplate using TypeScript.

When building [PebbleRail](https://github.com/jccit/pebblerail), I wanted to be able to use modern web tooling to write my PebbleKit JS app. That app performs a lot of data fetching and communication with the watch. However, the engine used in the Pebble app (and Core Devices app) targets something close to ES5.

This project adds a JS build step similar to what you would find in a modern web project, but with a focus on targeting the PebbleKit JS engine. Meaning you can use modern JS/TS features without worrying about compatability.

## How to use

### New project

1. Copy this project
2. Change the name, author and uuid in package.json
3. Install dependencies `npm install`
4. Build the app like normal, `pebble build` will compile your TypeScript and your Pebble app

### Existing project (advanced)

You can convert an existing PKJS to PKTS by copying a few files and making some config changes.

If you run into any issues I'd recommended following the "New Project" instructions and copying your existing C code into the new project.

1. Copy `babel.config.json`, `rollup.config.mjs`, `tsconfig.json`, `wscript` into your app, overwrite any existing files
2. Copy the `scripts`, `dependencies` and `devDependencies` from `package.json` into your project's `package.json`
3. Copy the `src/ts` folder to your project
4. Update `src/ts/index.ts` with your app's code. This is just the entrypoint so feel free to split your code using modules
5. Install dependencies `npm install`
6. Build the app like normal, `pebble build` will compile your TypeScript and your Pebble app

## Available types

- `ready` and `appmessage` events
- `sendAppMessage`
- `getTimelineToken`
- `showSimpleNotficationOnPebble`

# Tested JS/TS features

- async/await
- Promises
- String templates
- Arrow functions
- Array/object spreading

## Contributing

The [PKJS type definitions](https://github.com/jccit/PebbleKit.ts/blob/main/src/ts/pebble.d.ts) are incomplete are incomplete as I have only typed what is used in PebbleRail.

If you are using this in your own project and find yourself expanding the definitions, please contribute your changes back to this project so the community can benefit!
