'use strict'

const path = require('node:path')
const { test } = require('node:test')
const pino = require('pino')
const pinoDebug = require('pino-debug')
const through2 = require('through2')
const pinoCaller = require('../')

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

test('pino caller stack trace line number maps correctly', function (t) {
  t.plan(4)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /TestContext.<anonymous> \(\/(?:.)*tests\/test.js:(\d+)/
    const matches = regex.exec(res.caller || '')
    t.assert.ok(res.caller, 'caller property is set')
    t.assert.equal(typeof res.caller, 'string', 'caller property is a string')
    t.assert.ok(matches, 'caller property matches the test regex')
    t.assert.ok(parseInt(matches[1], 10) > 1, 'line number in stack trace is greater than 1')
  })))

  pinoInstance.fatal('test')
})
