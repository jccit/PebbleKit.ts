# PebbleKit.ts

A modern Pebble app boilerplate using TypeScript.

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

## Showcase

- [PebbleRail](https://apps.rebble.io/en_US/application/67a8c311b5e348000915b07b)
- [Tube Status](https://apps.rebble.io/en_US/application/529e8742d7894b189c000012) by Chris Lewis
- [Plurble](https://apps.rebble.io/en_US/application/67cbd46ed2acb301fae26e30) by Nikki

## Contributing

The [PKJS type definitions](https://github.com/jccit/PebbleKit.ts/blob/main/src/ts/pebble.d.ts) only cover a subset of the APIs available in PebbleKit JS.

If you are using this in your own project and find yourself expanding the definitions, please contribute your changes back to this project so the community can benefit!
