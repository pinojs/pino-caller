"use strict";

const OFFSET = process && process.version[1] > 6 ? 2 : 3

function _makeCallSiteGetter(pinoInstance, level) {
    return function () {
        var child = pinoInstance.child({
            caller: Error().stack.split('\n')[OFFSET].substr(7)
        })

        return child[level].apply(child, arguments)
    }
}

function traceCaller(pinoInstance) {
    var facade = Object.create(pinoInstance)
    Object.keys(pinoInstance.levels.values).forEach(function (level) {
        facade[level] = _makeCallSiteGetter(pinoInstance, level)
    })

    return facade
}

module.exports = traceCaller
