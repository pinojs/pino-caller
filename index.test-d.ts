import pino from 'pino'
import pinoCaller from '.'

const log = pino()
const callerLog = pinoCaller(log)

callerLog.info('hello')
callerLog.error('error!')

pinoCaller(log, { relativeTo: 'pwd' }).error('error!')
