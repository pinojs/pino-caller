import * as tape from 'tape'
import * as pino from 'pino'
import * as through2 from 'through2'
import { default as traceCaller } from '../'

import {
    LEVELS,
    Pino
} from '../interfaces/pino'

tape('extending works', tape => {
    tape.plan(1)
    const pinoInstance = traceCaller(pino(through2((chunk, enc, callback) => {
        console.log(chunk.toString('utf8'));
        tape.true(true)
    })))

    pinoInstance.info('test');
})
