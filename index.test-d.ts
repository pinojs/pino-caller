import pino, {Logger} from 'pino'
import pinoCaller, { pinoCaller as pinoCallerNamed } from ".";
import pinoCallerDefault from ".";
import * as pinoCallerStar from ".";
import pinoCallerCjsImport = require (".");
import {expectType} from "tsd";
const pinoCallerCjs = require(".");
const { pinoCaller: pinoCallerCjsNamed } = require('pino-caller')

const log = pino()
const callerLog = pinoCaller(log)

callerLog.info('hello')
callerLog.error('error!')

pinoCaller(log, { relativeTo: 'pwd' }).error('error!')

expectType<Logger>(pinoCallerNamed(log));
expectType<Logger>( pinoCallerDefault(log));
expectType<Logger>(pinoCallerStar.pinoCaller(log));
expectType<Logger>(pinoCallerStar.default(log));
expectType<Logger>( pinoCallerCjsImport.pinoCaller(log));
expectType<Logger>( pinoCallerCjsImport.default(log));
expectType<any>( new pinoCallerCjs(log));
expectType<any>( new pinoCallerCjsNamed(log));