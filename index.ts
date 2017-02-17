import {
    VALUES,
    Pino
} from './interfaces/pino'

function _makeCallSiteGetter (pinoInstance: Pino, level: VALUES) {
    return function() {
        const child = pinoInstance.child({
            caller: Error().stack.split('\n')[2].trim().replace('at ', '')
        })

        return child[level].apply(child, arguments)
    }
}

export default function traceCaller(pinoInstance: Pino) : Pino {
    const facade = Object.create(pinoInstance)
    Object.keys(pinoInstance.levels.values).forEach(function(level: VALUES) {
        facade[level] = _makeCallSiteGetter(pinoInstance, level)
    })

    return facade
}
