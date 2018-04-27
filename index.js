'use strict'
const NODEJS_VERSION = Number(process.version.slice(1).split('.')[0]);
const STACKTRACE_OFFSET = NODEJS_VERSION && NODEJS_VERSION > 6 ? 4 : 5
const LINE_OFFSET = 7

function traceCaller (pinoInstance) {
  function get (target, name) {
    return name === 'asJson' ? asJson : target[name]
  }

  function asJson (...args) {
    args[0] = args[0] || Object.create(null)
    args[0].caller = Error().stack.split('\n')[STACKTRACE_OFFSET].substr(LINE_OFFSET)
    return pinoInstance.asJson.apply(this, args)
  }

  return new Proxy(pinoInstance, { get })
}

module.exports = traceCaller
