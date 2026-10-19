'use strict'

const path = require('node:path')
const { test } = require('node:test')
const pino = require('pino')
const pinoDebug = require('pino-debug')
const through2 = require('through2')
const pinoCaller = require('../')
const { logFromTypeScript } = require('./fixtures/source-mapped')

test('pino caller works', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /TestContext.<anonymous> \(\/(.)*tests\/test.js/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))

  pinoInstance.info('test')
})

test('pino caller works also when adding level', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /TestContext.<anonymous> \(\/(.)*tests\/test.js/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))

  pinoInstance.level = 'fatal'
  pinoInstance.level = 'trace'
  pinoInstance.level = 'fatal'
  pinoInstance.trace('test')
  pinoInstance.fatal('test')
})

test('pino caller works also when switching level', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino({
    customLevels: {
      myLevel: 100
    }
  }, through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /TestContext.<anonymous> \(\/(.)*tests\/test.js/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))
  pinoInstance.level = 'myLevel'
  pinoInstance.level = 'trace'
  pinoInstance.level = 'myLevel'
  pinoInstance.trace('test')
  pinoInstance.myLevel('test')
})

test('pino caller works also with pino plugins', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino({
    customLevels: {
      myLevel: 100
    }
  }, through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /TestContext.<anonymous> \(\/(.)*tests\/test.js/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))

  pinoDebug(pinoInstance, { map: { '*': 'trace' } })

  pinoInstance.info('test')
})

test('pino caller works also with relativeTo parameter set', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /TestContext.<anonymous> \(test.js/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })), { relativeTo: __dirname })

  pinoInstance.info('test')
})

test('pino caller works also when relativeTo has a trailing slash', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /TestContext.<anonymous> \(test.js/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })), { relativeTo: path.join(__dirname, '/') })

  pinoInstance.info('test')
})

test('pino caller can make stack adjustments', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /TestContext.<anonymous> \(\/(.)*tests\/test.js/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })), { stackAdjustment: 1 })

  // Create a wrapper around pino so that we can show that stackAdjustment can bypass this stack frame.
  const log = {
    info: function (message) {
      pinoInstance.info(message)
    }
  }
  log.info('test')
})

test('pino caller works also when called from evaluated code', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /^eval \(eval at .*tests\/test.js/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))

  // eslint-disable-next-line no-new-func
  new Function('log', 'log.info("test")')(pinoInstance)
})

test('pino caller works also with sourcemaps', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /logFromTypeScript \(\/(.)*tests\/fixtures\/source-mapped.ts:9:/
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))

  logFromTypeScript(pinoInstance)
})

test('pino caller restores Error.prepareStackTrace', function (t) {
  t.plan(1)

  const prepareStackTrace = Error.prepareStackTrace
  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {})))

  pinoInstance.info('test')
  t.assert.equal(Error.prepareStackTrace, prepareStackTrace, 'Error.prepareStackTrace is restored')
})
