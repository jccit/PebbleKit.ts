# PebbleKit.ts

A modern Pebble app boilerplate using TypeScript.

When building [PebbleRail](https://github.com/jccit/pebblerail), I wanted to be able to use modern web tooling to write my PebbleKit JS app. That app performs a lot of data fetching and communication with the watch. However, the engine used in the Pebble app (and Core Devices app) targets something close to ES5.

This project adds a JS build step similar to what you would find in a modern web project, but with a focus on targeting the PebbleKit JS engine. Meaning you can use modern JS/TS features without worrying about compatability.

Also provided are modern wrappers around PKJS functions, available under the PebbleTS namespace.

## How to use

1. Run `npx pkts init` in your Pebble project
2. Install dependencies `npm install`
3. Build your app like normal, `pebble build` will compile your TypeScript and your Pebble app

## CLI commands

- `pkts init` - Configures your Pebble project to use PKTS
- `pkts doctor` - Checks for configuration issues preventing PKTS from working correctly
- `pkts doctor --fix` - Automatically fixes any found issues
- `pkts build` - Compiles TS -> JS, ready for Pebble SDK to bundle into your app

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
