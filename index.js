'use strict'

const STACKTRACE_OFFSET = process && process.version[1] > 6 ? 2 : 3
const LINE_OFFSET = 7

function _makeCallSiteGetter (pinoInstance, level) {
  return function () {
    const child = pinoInstance.child({
      caller: Error().stack.split('\n')[STACKTRACE_OFFSET].substr(LINE_OFFSET)
    })

    return child[level].apply(child, arguments)
  }
}

function traceCaller (pinoInstance) {
  const facade = Object.create(pinoInstance)
  Object.keys(pinoInstance.levels.values).forEach(function (level) {
    facade[level] = facade[`_${level}`] = _makeCallSiteGetter(pinoInstance, level)
  })

  return facade
}

module.exports = traceCaller
