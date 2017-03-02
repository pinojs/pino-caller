'use strict'

const STACKTRACE_OFFSET = process && process.version[1] > 6 ? 4 : 5
const LINE_OFFSET = 7

function traceCaller (pinoInstance) {
  return Object.assign(Object.create(pinoInstance), {
    asJson: function (...args) {
      args[0] = args[0] || Object.create(null)
      args[0].caller = Error().stack.split('\n')[STACKTRACE_OFFSET].substr(LINE_OFFSET)
      return pinoInstance.asJson.apply(this, args)
    }
  })
}

module.exports = traceCaller
