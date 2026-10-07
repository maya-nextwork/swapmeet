import { useEffect, useState } from 'react'
import { getListings } from '../api.js'
import { ItemCard } from '../design-system'
import CategoryFilter from './CategoryFilter.jsx'
import { categoryLabel, conditionLabel, formatPrice } from './format.js'

export default function ListingGrid({ categories, category, onCategoryChange }) {
  const [listings, setListings] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let live = true
    setListings(null)
    setError(null)
    getListings(category)
      .then((data) => live && setListings(data))
      .catch((err) => live && setError(err.message))
    return () => {
      live = false
    }
  }, [category])

  return (
    <section>
      <h1 className="text-h1 sm-page-title">Local listings</h1>
      <p className="text-body sm-soft">Gear from people building something nearby.</p>

      <CategoryFilter categories={categories} value={category} onChange={onCategoryChange} />

      {error && (
        <p className="sm-error" role="alert">
          Couldn't load listings: {error}
        </p>
      )}
      {!error && !listings && <p className="sm-soft">Loading listings…</p>}
      {listings && listings.length === 0 && <p className="sm-soft">Nothing listed in this category yet.</p>}

      {listings && listings.length > 0 && (
        <ul className="sm-grid">
          {listings.map((l) => (
            <li key={l.id}>
              <a href={`#/listings/${l.id}`} className="sm-card-link" aria-label={`${l.title}, ${formatPrice(l.price)}`}>
                <ItemCard
                  price={formatPrice(l.price)}
                  title={l.title}
                  distance={l.location}
                  note={conditionLabel(l.condition)}
                  emoji={l.emoji}
                  badge={{ label: categoryLabel(categories, l.category), color: 'denim' }}
                  className="sm-card"
                />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
