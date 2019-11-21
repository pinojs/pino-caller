## pino-caller&nbsp;&nbsp;[![Coverage Status](https://coveralls.io/repos/github/pinojs/pino-caller/badge.svg?branch=master)](https://coveralls.io/github/pinojs/pino-caller?branch=master)&nbsp;[![Build Status](https://travis-ci.org/pinojs/pino-caller.svg?branch=master)](https://travis-ci.org/pinojs/pino-caller)

### Description
`pino-caller` is a wrapper for [pino](https://github.com/pinojs/pino) which adds the call site of each log message to the log output.
This can be useful when developing with large codebases in order to locate the exact point where pino is invoked.

### Install

For Pino v4 and below use the v2 line, which can be installed with the `@legacy` tag:

```sh
npm install pino-caller@legacy
```

For Pino v5 and above use the v3+ line, which will install using the usual command:

```
npm install pino-caller
```

**WARNING: THIS IS A DEVELOPMENT TOOL AVOID PRODUCTION USE!**

### Usage

#### Basic
In cases where the stack trace offset are wrong, the following options are available:

- `stackTraceOffset` to increase the stack trace offset. Default to 0.
- `lineOffset` to increase the line offset. Default to 0.

```js
'use strict'

const pino = require('pino')() // it will print as usual
const pinoCaller = require('pino-caller')(pino, {stackTraceOffset: 1, lineOffset:1}) // it will print also the calling site

pinoCaller.info('info1')
pinoCaller.error('error1')
pinoCaller.debug('debug1')
```

#### Advanced
```js
'use strict'
// dinamically load the plugin if in development environment
const pino = process.env.NODE_ENV === 'development' ? require('pino-caller')(require('pino')()) : require('pino')()

pino.info('info1')
pino.error('error1')
pino.debug('debug1')
```

You can find also a working example in the `examples` directory and you can run it with `npm run example`

### Example output

```
╭─phra at debian in /home/phra/git/pino-caller (master ✔)
╰─λ npm run example

> pino-caller@1.0.0 example /home/phra/git/pino-caller
> env NODE_ENV=development node examples/index.js

{"pid":44837,"hostname":"debian","level":30,"time":1487873713227,"msg":"hello from the module!","caller":"Object.<anonymous> (/home/phra/git/pino-caller/examples/module.js:4:12)","v":1}
{"pid":44837,"hostname":"debian","level":30,"time":1487873713230,"msg":"info1","caller":"Object.<anonymous> (/home/phra/git/pino-caller/examples/index.js:8:12)","v":1}
{"pid":44837,"hostname":"debian","level":50,"time":1487873713230,"msg":"error1","caller":"Object.<anonymous> (/home/phra/git/pino-caller/examples/index.js:9:12)","v":1}
```
