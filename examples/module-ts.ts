const pino = process.env.NODE_ENV === 'development' ? require('../')(require('pino')()) : require('pino')()

function add(n: number, m: number) {
  return n + m
}

async function main() {
  pino.info(add(2, 3))
}

main()

