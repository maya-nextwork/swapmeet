import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { readFile, writeFile, rename, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATEGORIES, isKnownCategory } from './categories.js'
import { validateNewListing } from './validate.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '..', 'data', 'listings.json')
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist')

const app = Fastify({ logger: true })

async function loadListings() {
  const raw = await readFile(DATA_FILE, 'utf8')
  return JSON.parse(raw)
}

// Atomic write: a temp file in the same directory, then rename over the original.
async function saveListings(listings) {
  const tmp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`
  try {
    await writeFile(tmp, JSON.stringify(listings, null, 2) + '\n', 'utf8')
    await rename(tmp, DATA_FILE)
  } catch (err) {
    await unlink(tmp).catch(() => {})
    throw err
  }
}

// Next lst-NNN: highest existing number + 1, zero-padded to 3.
function nextListingId(listings) {
  const max = listings.reduce((m, l) => {
    const match = /^lst-(\d+)$/.exec(l.id)
    return match ? Math.max(m, Number(match[1])) : m
  }, 0)
  return `lst-${String(max + 1).padStart(3, '0')}`
}

// Today in the server's local timezone, as YYYY-MM-DD.
function today() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Serializes read-modify-write cycles so concurrent POSTs cannot reuse an id or drop a write.
let writeQueue = Promise.resolve()
function withWriteLock(fn) {
  const run = writeQueue.then(fn)
  writeQueue = run.catch(() => {})
  return run
}

app.get('/api/health', async () => ({ status: 'ok', service: 'swapmeet-api' }))

app.get('/api/categories', async () => CATEGORIES)

app.get('/api/listings', async (request, reply) => {
  const { category } = request.query
  if (category !== undefined && !isKnownCategory(category)) {
    return reply.code(400).send({ error: 'Unknown category', category })
  }
  const all = await loadListings()
  const listings = category === undefined ? all : all.filter((l) => l.category === category)
  request.log.info({ count: listings.length, category }, 'served listings')
  return listings
})

app.get('/api/listings/:id', async (request, reply) => {
  const listings = await loadListings()
  const listing = listings.find((l) => l.id === request.params.id)
  if (!listing) {
    return reply.code(404).send({ error: 'Listing not found', id: request.params.id })
  }
  return listing
})

app.post('/api/listings', async (request, reply) => {
  const { listing: fields, fields: errors } = validateNewListing(request.body)
  if (errors) {
    request.log.info({ fields: Object.keys(errors) }, 'rejected listing')
    return reply.code(400).send({ error: 'Validation failed', fields: errors })
  }
  const listing = await withWriteLock(async () => {
    const listings = await loadListings()
    const created = {
      id: nextListingId(listings),
      title: fields.title,
      price: fields.price,
      category: fields.category,
      condition: fields.condition,
      emoji: fields.emoji,
      description: fields.description,
      seller: fields.seller,
      location: fields.location,
      postedAt: today(),
    }
    await saveListings([...listings, created])
    return created
  })
  request.log.info({ id: listing.id }, 'created listing')
  return reply.code(201).send(listing)
})

// Serve the built React app when client/dist exists (production mode).
// In development the Vite dev server handles the frontend and proxies /api here.
if (existsSync(CLIENT_DIST)) {
  app.register(fastifyStatic, { root: CLIENT_DIST })
}

const port = Number(process.env.PORT) || 3001
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err)
  process.exit(1)
})
