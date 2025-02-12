import {test, type TestContext} from 'node:test'
import pino from 'pino'
import * as through2 from 'through2'
import pinoCaller from '../'

test('pino caller works with sourcemaps (typescript)', function (t: TestContext) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /TestContext.<anonymous> \(\/(.)*tests\/test-ts.ts/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))

  pinoInstance.info('test')
})
