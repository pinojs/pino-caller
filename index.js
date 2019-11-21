'use strict'

const NODEJS_VERSION = parseInt(process.version.slice(1).split('.')[0], 10)
const STACKTRACE_OFFSET = NODEJS_VERSION && NODEJS_VERSION > 6 ? 2 : 3
const LINE_OFFSET = 7
const { symbols } = require('pino')
const { asJsonSym } = symbols

function traceCaller (pinoInstance) {
  function get (target, name) {
    return name === asJsonSym ? asJson : target[name]
  }

  function asJson (...args) {
    args[0] = args[0] || Object.create(null)
    args[0].caller = Error().stack.split('\n').filter(s => !s.includes('node_modules/pino'))[STACKTRACE_OFFSET].substr(LINE_OFFSET)
    return pinoInstance[asJsonSym].apply(this, args)
  }

  return new Proxy(pinoInstance, { get })
}

module.exports = traceCaller
