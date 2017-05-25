'use strict'

const STACKTRACE_OFFSET = process && process.version[1] > 6 ? 4 : 5
const LINE_OFFSET = 7

function traceCaller (pinoInstance) {
  function get (target, name) {
    return name === 'asJson' ? asJson : target[name]
  }

  function asJson () {
    const args = Array.prototype.slice.call(arguments)
    args[0] = args[0] || Object.create(null)
    args[0].caller = Error().stack.split('\n')[STACKTRACE_OFFSET].substr(LINE_OFFSET)
    return pinoInstance.asJson.apply(this, args)
  }

  return new Proxy(pinoInstance, { get: get })
}

module.exports = traceCaller
