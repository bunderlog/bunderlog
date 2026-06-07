// tools/merge-coverage.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { glob } from 'glob'
import { dirname, resolve, relative } from 'path'

const ROOT = process.cwd()

function safePath(filePath) {
  const abs = resolve(ROOT, filePath)
  if (!abs.startsWith(ROOT + '/')) {
    throw new Error(`Path traversal detected: ${filePath}`)
  }
  if (!existsSync(abs)) {
    throw new Error(`File not found: ${abs}`)
  }
  return abs
}

const files = await glob('**/coverage/lcov.info', {
  ignore: ['**/node_modules/**', '**/.turbo/**', 'coverage/lcov.info'],
  cwd: ROOT,
})

const merged = files
  .map((lcovPath) => {
    const safeAbs = safePath(lcovPath) // ← валидированный путь
    const pkgDir = resolve(ROOT, dirname(dirname(lcovPath)))
    const content = readFileSync(safeAbs, 'utf8') // ← литерал из safePath

    return content
      .split('\n')
      .map((line) => {
        if (!line.startsWith('SF:')) return line
        const filePath = line.slice(3)
        if (filePath.includes('node_modules')) return null
        if (filePath.startsWith('\x00')) return null
        const absPath = resolve(pkgDir, filePath)
        if (!absPath.startsWith(ROOT + '/')) return null // path traversal в SF:
        const relPath = relative(ROOT, absPath)
        return `SF:${relPath}`
      })
      .filter(Boolean)
      .join('\n')
  })
  .join('\n')

mkdirSync('coverage', { recursive: true })
writeFileSync(resolve(ROOT, 'coverage/lcov.info'), merged)
console.log(`Merged ${files.length} files → coverage/lcov.info`)
