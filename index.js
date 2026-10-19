'use strict'

require('source-map-support/register')
const { wrapCallSite } = require('source-map-support')
const NODEJS_VERSION = parseInt(process.version.slice(1).split('.')[0], 10)
const STACKTRACE_OFFSET = NODEJS_VERSION && NODEJS_VERSION > 6 ? 0 : 1
const { symbols } = require('pino')
const { asJsonSym } = symbols

function returnCallSites (_, callSites) {
  return callSites
}

// `stack` is computed on first read, so it must be read before restoring
function captureCallSites (belowFunction) {
  const originalPrepareStackTrace = Error.prepareStackTrace
  const holder = {}
  try {
    Error.prepareStackTrace = returnCallSites
    Error.captureStackTrace(holder, belowFunction)
    return holder.stack
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace
  }
}

function isPinoFrame (callSite) {
  const fileName = callSite.getFileName() || ''
  return fileName.includes('node_modules/pino') || fileName.includes('node_modules\\pino')
}

// source-map-support names a mapped function from the position of its calling frame
function formatCallSite (callSites, index) {
  const sourceMapState = { nextPosition: null, curPosition: null }
  if (index + 1 < callSites.length) {
    wrapCallSite(callSites[index + 1], sourceMapState)
    sourceMapState.nextPosition = sourceMapState.curPosition
  }
  return String(wrapCallSite(callSites[index], sourceMapState))
}

function traceCaller (pinoInstance, options = { relativeTo: null, stackAdjustment: 0 }) {
  const adjustment = options.stackAdjustment || 0

  function get (target, name) {
    return name === asJsonSym ? asJson : target[name]
  }

  function asJson (...args) {
    args[0] = args[0] || Object.create(null)
    const callSites = captureCallSites(asJson)
    const caller = callSites.filter(callSite => !isPinoFrame(callSite))[STACKTRACE_OFFSET + adjustment]
    args[0].caller = formatCallSite(callSites, callSites.indexOf(caller))
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
