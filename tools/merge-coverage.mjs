import { readFileSync, writeFileSync, mkdirSync, realpathSync } from 'fs'
import { dirname, resolve, relative } from 'path'

const ROOT = process.cwd()

const files = ['apps/web/coverage/lcov.info']

const merged = files
  .map((lcovPath) => {
    const absLcov = resolve(ROOT, lcovPath)
    // Resolve symlinks to the real path and ensure it stays inside the repository root
    const realAbsLcov = realpathSync(absLcov)
    if (relative(ROOT, realAbsLcov).startsWith('..')) {
      throw new Error(`Invalid lcov path (outside root): ${lcovPath}`)
    }
    const pkgDir = resolve(ROOT, dirname(dirname(realAbsLcov))) // apps/ingest
    const content = readFileSync(realAbsLcov, 'utf8')

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
