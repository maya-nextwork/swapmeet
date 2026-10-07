// Display helpers for the Listing contract. The server sends raw values;
// labels and formatting are the client's job.

export const CONDITIONS = [
  { id: 'used-like-new', label: 'Like new' },
  { id: 'used-good', label: 'Good' },
  { id: 'used-fair', label: 'Fair' }
]

export function conditionLabel(id) {
  return CONDITIONS.find((c) => c.id === id)?.label ?? id
}

export function categoryLabel(categories, id) {
  return categories?.find((c) => c.id === id)?.label ?? id
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function formatPrice(price) {
  return usd.format(price)
}

export function formatDate(ymd) {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
