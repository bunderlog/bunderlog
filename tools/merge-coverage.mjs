// tools/merge-coverage.mjs
import { glob } from 'glob'
import { dirname, resolve, relative } from 'path'

const ROOT = process.cwd()

function validatePath(filePath) {
  const abs = resolve(ROOT, filePath)
  if (!abs.startsWith(ROOT + '/')) {
    throw new Error(`Path traversal detected: ${filePath}`)
  }
  return abs
}

const files = await glob('**/coverage/lcov.info', {
  ignore: ['**/node_modules/**', '**/.turbo/**', 'coverage/lcov.info'],
  cwd: ROOT,
})

const parts = await Promise.all(
  files.map(async (lcovPath) => {
    const safeAbs = validatePath(lcovPath)
    const pkgDir = resolve(ROOT, dirname(dirname(lcovPath)))
    const content = await Bun.file(safeAbs).text() // ← не fs

    return content
      .split('\n')
      .map((line) => {
        if (!line.startsWith('SF:')) return line
        const filePath = line.slice(3)
        if (filePath.includes('node_modules')) return null
        if (filePath.startsWith('\x00')) return null
        const absPath = resolve(pkgDir, filePath)
        if (!absPath.startsWith(ROOT + '/')) return null
        return `SF:${relative(ROOT, absPath)}`
      })
      .filter(Boolean)
      .join('\n')
  }),
)

await Bun.write(resolve(ROOT, 'coverage/lcov.info'), parts.join('\n'))

console.log(`Merged ${files.length} files → coverage/lcov.info`)
