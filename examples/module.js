'use strict'

const pino = process.env.NODE_ENV === 'development' ? require('../')(require('pino')()) : require('pino')()

pino.info('hello from the module!')
