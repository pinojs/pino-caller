'use strict'

var path = require('path')
var test = require('tap').test
var pino = require('pino')
var pinoDebug = require('pino-debug')
var through2 = require('through2')
var pinoCaller = require('../')

test('pino caller works', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /Test.<anonymous> \(\/(.)*tests\/test.js/
    t.ok(res.caller, 'caller property is set')
    t.equal(typeof res.caller, 'string', 'caller property is a string')
    t.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))

  pinoInstance.info('test')
})

test('pino caller works also when adding level', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /Test.<anonymous> \(\/(.)*tests\/test.js/
    t.ok(res.caller, 'caller property is set')
    t.equal(typeof res.caller, 'string', 'caller property is a string')
    t.ok(regex.test(res.caller), 'caller property matches the test regex')
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
    const regex = /Test.<anonymous> \(\/(.)*tests\/test.js/
    t.ok(res.caller, 'caller property is set')
    t.equal(typeof res.caller, 'string', 'caller property is a string')
    t.ok(regex.test(res.caller), 'caller property matches the test regex')
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
    const regex = /Test.<anonymous> \(\/(.)*tests\/test.js/
    t.ok(res.caller, 'caller property is set')
    t.equal(typeof res.caller, 'string', 'caller property is a string')
    t.ok(regex.test(res.caller), 'caller property matches the test regex')
  })))

  pinoDebug(pinoInstance, { map: { '*': 'trace' } })

  pinoInstance.info('test')
})

test('pino caller works also with relativeTo parameter set', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /Test.<anonymous> \(test.js/
    t.ok(res.caller, 'caller property is set')
    t.equal(typeof res.caller, 'string', 'caller property is a string')
    t.ok(regex.test(res.caller), 'caller property matches the test regex')
  })), { relativeTo: __dirname })

  pinoInstance.info('test')
})

test('pino caller works also when relativeTo has a trailing slash', function (t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /Test.<anonymous> \(test.js/
    t.ok(res.caller, 'caller property is set')
    t.equal(typeof res.caller, 'string', 'caller property is a string')
    t.ok(regex.test(res.caller), 'caller property matches the test regex')
  })), { relativeTo: path.join(__dirname, '/') })

  pinoInstance.info('test')
})

test('pino caller can make stack adjustments', function(t) {
  t.plan(3)

  const pinoInstance = pinoCaller(pino(through2(function (chunk, enc, callback) {
    const res = JSON.parse(chunk.toString('utf8'))
    const regex = /Test.<anonymous> \(\/(.)*tests\/test.js/
    t.ok(res.caller, 'caller property is set')
    t.equal(typeof res.caller, 'string', 'caller property is a string')
    t.ok(regex.test(res.caller), 'caller property matches the test regex')
  })), { stackAdjustment: 1 })

  // Create a wrapper around pino so that we can show that stackAdjustment can bypass this stack frame.
  const log = {
    info: function(message) {
      pinoInstance.info(message)
    }
  }
  log.info('test')
})
