import tap = require('tap')
import pino = require('pino')
import * as through2 from 'through2'
import pinoCaller from '../'

tap.test('pino caller works with sourcemaps (typescript)', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /Test.<anonymous> \(\/(.)*tests\/test-ts.ts/
    t.ok(res.caller, 'caller property is set')
    t.equal(typeof res.caller, 'string', 'caller property is a string')
    t.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))

  pinoInstance.info('test')
})
