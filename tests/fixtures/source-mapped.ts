// Compiled to source-mapped.js with:
// npx tsc --ignoreConfig --inlineSourceMap --target es2019 --module commonjs tests/fixtures/source-mapped.ts

interface Log {
  info (message: string): void
}

export function logFromTypeScript (log: Log): void {
  log.info('test')
}
