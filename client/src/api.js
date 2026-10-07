// Every network call lives here: the single swap point for the #1 contracts.

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `API responded ${status}`)
    this.status = status
    this.body = body
  }
}

async function request(path, options) {
  const res = await fetch(path, options)
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, body)
  return body
}

export function getCategories() {
  return request('/api/categories')
}

// "All" sends no category param.
export function getListings(category) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : ''
  return request(`/api/listings${qs}`)
}

export function getListing(id) {
  return request(`/api/listings/${encodeURIComponent(id)}`)
}

// Resolves to the created listing (201). A 400 rejects with ApiError whose
// body is { error, fields: { <field>: <message> } }.
export function createListing(listing) {
  return request('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing)
  })
}

