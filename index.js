'use strict'

require('source-map-support/register')
const NODEJS_VERSION = parseInt(process.version.slice(1).split('.')[0], 10)
const STACKTRACE_OFFSET = NODEJS_VERSION && NODEJS_VERSION > 6 ? 0 : 1
const LINE_OFFSET = 7
const { symbols } = require('pino')
const { asJsonSym } = symbols

function traceCaller (pinoInstance, options = {relativeTo: null, stackAdjustment: 0}) {
  const adjustment = options.stackAdjustment || 0

  function get (target, name) {
    return name === asJsonSym ? asJson : target[name]
  }

  function asJson (...args) {
    args[0] = args[0] || Object.create(null)
    args[0].caller = Error().stack.split('\n').slice(2).filter(s => !s.includes('node_modules/pino') && !s.includes('node_modules\\pino'))[STACKTRACE_OFFSET + adjustment].substr(LINE_OFFSET)
    if (options && typeof options.relativeTo === 'string') {
      const lastChar = options.relativeTo[options.relativeTo.length - 1]
      const hasTrailingSlash = lastChar === '/' || lastChar === '\\'

      args[0].caller = args[0].caller
        .replace(hasTrailingSlash ? options.relativeTo : options.relativeTo + '/', '')
        .replace(hasTrailingSlash ? options.relativeTo : options.relativeTo + '\\', '')
    }
    return pinoInstance[asJsonSym].apply(this, args)
  }

  return new Proxy(pinoInstance, { get })
}

/**
 * These export configurations enable JS and TS developers
 * to consumer pino-caller in whatever way best suits their needs.
 * Some examples of supported import syntax includes:
 * - `const pinoCaller = require('pino-caller')`
 * - `const { pinoCaller } = require('pino-caller')`
 * - `import * as pinoCaller from 'pino-caller'`
 * - `import { pinoCaller } from 'pino-caller'`
 * - `import pinoCaller from 'pino-caller'`
 */
traceCaller.pinoCaller = traceCaller
traceCaller.default = traceCaller
module.exports = traceCaller
