# Pebble.ts

A modern Pebble app boilerplate using TypeScript.

When building [PebbleRail](https://github.com/jccit/pebblerail), I wanted to be able to use modern web tooling to write my PebbleKitJS app. That app performs a lot of data fetching and communication with the watch. However, the engine used in the Pebble app (and Core Devices app) targets something close to ES5.

This project adds a JS build step similar to what you would find in a modern web project, but with a focus on targeting the PebbleKit JS engine. Meaning you can use modern JS/TS features without worrying about compatability.

## How to use

1. Copy this project
2. Change the name, author and uuid in package.json
3. Install dependencies `npm install`
4. Build the app like normal, `pebble build` will compile your TypeScript and your Pebble app

## Available types

- `ready` and `appmessage` events
- `sendAppMessage`
- `getTimelineToken`
- `showSimpleNotficationOnMebble`

# Tested JS/TS features

- async/await
- Promises
- String templates
- Arrow functions
- Array/object spreading

## Contributing

The [PKJS type definitions](https://github.com/jccit/pebble.ts/blob/main/src/ts/pebble.d.ts) are incomplete are incomplete as I have only typed what is used in PebbleRail.

If you are using this in your own project and find yourself expanding the definitions, please contribute your changes back to this project so the community can benefit!
