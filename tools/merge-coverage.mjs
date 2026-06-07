import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, resolve, relative } from 'path'

const ROOT = process.cwd()

const files = ['apps/web/coverage/lcov.info']

const merged = files
  .map((lcovPath) => {
    const pkgDir = resolve(ROOT, dirname(dirname(lcovPath))) // apps/ingest
    const content = readFileSync(lcovPath, 'utf8')

    return content
      .split('\n')
      .map((line) => {
        if (!line.startsWith('SF:')) return line
        const filePath = line.slice(3) // src/index.ts
        const absPath = resolve(pkgDir, filePath) // /repo/apps/ingest/src/index.ts
        const relPath = relative(ROOT, absPath) // apps/ingest/src/index.ts
        return `SF:${relPath}`
      })
      .join('\n')
  })
  .join('\n')

mkdirSync('coverage', { recursive: true })
writeFileSync('coverage/lcov.info', merged)
console.log(`Merged ${files.length} files → coverage/lcov.info`)
