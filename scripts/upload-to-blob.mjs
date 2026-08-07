import { put } from '@vercel/blob'
import { readdir, readFile, stat } from 'fs/promises'
import { join, relative } from 'path'

const ROOT   = new URL('..', import.meta.url).pathname
const SRC    = join(ROOT, 'public', 'portfolio')
const TOKEN  = process.env.BLOB_READ_WRITE_TOKEN
const CONCURRENCY = 5

if (!TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN is not set')
  process.exit(1)
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files   = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) files.push(...await walk(full))
    else files.push(full)
  }
  return files
}

async function uploadBatch(files) {
  const results = []
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY)
    const settled = await Promise.allSettled(
      batch.map(async (file) => {
        const relPath   = relative(join(ROOT, 'public'), file) // e.g. portfolio/altexsoft/001.../image-1.png
        const content   = await readFile(file)
        const ext       = file.split('.').pop().toLowerCase()
        const mimeMap   = {
          jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
          webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
          avif: 'image/avif',
        }
        const contentType = mimeMap[ext] ?? 'application/octet-stream'
        const blob = await put(relPath, content, {
          access: 'public',
          addRandomSuffix: false,
          contentType,
          token: TOKEN,
        })
        return { local: '/' + relPath, url: blob.url }
      })
    )
    for (const r of settled) {
      if (r.status === 'fulfilled') results.push(r.value)
      else console.error('  FAILED:', r.reason?.message ?? r.reason)
    }
    const done = Math.min(i + CONCURRENCY, files.length)
    process.stdout.write(`\r  Uploaded ${done}/${files.length}`)
  }
  console.log()
  return results
}

console.log('Scanning public/portfolio/ ...')
const allFiles = await walk(SRC)
console.log(`Found ${allFiles.length} files. Uploading...`)

const results = await uploadBatch(allFiles)

// Print first result so we can verify the URL pattern
if (results.length > 0) {
  console.log('\nSample mapping:')
  console.log('  local:', results[0].local)
  console.log('  blob: ', results[0].url)
}

// Derive the blob base URL from the first result
const first = results[0]
const blobBase = first.url.replace(first.local, '') // e.g. https://hdFQv9...blob.vercel-storage.com

console.log('\nBlob base URL:', blobBase)
console.log(`\nDone. ${results.length}/${allFiles.length} files uploaded.`)
console.log('\nPaste this as BLOB_BASE in the rewrite script:')
console.log(blobBase)
