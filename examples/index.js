'use strict'

const pino = process.env.NODE_ENV === 'development' ? require('../')(require('pino')(), { relativeTo: __dirname }) : require('pino')()

require('./module')

pino.info('info1')
pino.error('error1')
pino.debug('debug1')
