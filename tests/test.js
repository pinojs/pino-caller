'use strict'

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

test('pino caller with sourcemaps', function (t) {
  t.plan(0)
  require('./test-ts')
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
