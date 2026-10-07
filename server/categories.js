// Fixed category list, in display order. Contract: GET /api/categories (refs #1).
export const CATEGORIES = [
  { id: 'restaurant-equipment', label: 'Restaurant equipment' },
  { id: 'maker-tools', label: 'Maker tools' },
  { id: 'retail', label: 'Retail' },
  { id: 'landscaping', label: 'Landscaping' },
  { id: 'events', label: 'Events' },
]

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id))

export function isKnownCategory(id) {
  return CATEGORY_IDS.has(id)
}
