import { isKnownCategory } from './categories.js'

export const CONDITIONS = ['used-like-new', 'used-good', 'used-fair']
const DEFAULT_EMOJI = '📦'
const MAX_PRICE = 1_000_000

// Checks a trimmed string field. Returns [value, error].
function checkString(value, label, min, max) {
  if (value === undefined || value === null) return [undefined, `${label} is required`]
  if (typeof value !== 'string') return [undefined, `${label} must be text`]
  const trimmed = value.trim()
  if (trimmed.length === 0) return [undefined, `${label} is required`]
  if (trimmed.length < min || trimmed.length > max) {
    return [undefined, `${label} must be ${min} to ${max} characters`]
  }
  return [trimmed, null]
}

// Validates a POST /api/listings body against the contract in #1.
// Returns { listing } with only the known fields, or { fields } with one message per failing field.
// Client-sent id, postedAt, and any other fields are ignored.
export function validateNewListing(body) {
  const input = body && typeof body === 'object' && !Array.isArray(body) ? body : {}
  const fields = {}
  const listing = {}

  const strings = [
    ['title', 'Title', 3, 80],
    ['description', 'Description', 1, 1000],
    ['seller', 'Seller', 1, 60],
    ['location', 'Location', 1, 60],
  ]
  for (const [key, label, min, max] of strings) {
    const [value, error] = checkString(input[key], label, min, max)
    if (error) fields[key] = error
    else listing[key] = value
  }

  const { price } = input
  if (price === undefined || price === null || price === '') {
    fields.price = 'Price is required'
  } else if (typeof price !== 'number' || !Number.isInteger(price)) {
    fields.price = 'Price must be a whole number of dollars'
  } else if (price < 0 || price > MAX_PRICE) {
    fields.price = 'Price must be between $0 and $1,000,000'
  } else {
    listing.price = price
  }

  if (input.category === undefined || input.category === null || input.category === '') {
    fields.category = 'Category is required'
  } else if (!isKnownCategory(input.category)) {
    fields.category = 'Choose a category from the list'
  } else {
    listing.category = input.category
  }

  if (input.condition === undefined || input.condition === null || input.condition === '') {
    fields.condition = 'Condition is required'
  } else if (!CONDITIONS.includes(input.condition)) {
    fields.condition = 'Condition must be Like new, Good, or Fair'
  } else {
    listing.condition = input.condition
  }

  const { emoji } = input
  if (emoji === undefined || emoji === null || (typeof emoji === 'string' && emoji.trim() === '')) {
    listing.emoji = DEFAULT_EMOJI
  } else if (typeof emoji !== 'string') {
    fields.emoji = 'Emoji must be text'
  } else {
    listing.emoji = emoji.trim()
  }

  if (Object.keys(fields).length > 0) return { fields }
  return { listing }
}
