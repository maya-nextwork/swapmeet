import { useEffect, useState } from 'react'
import { getListing } from '../api.js'
import { Badge, Button, Icon } from '../design-system'
import { categoryLabel, conditionLabel, formatDate, formatPrice } from './format.js'

function backToGrid() {
  window.location.hash = '#/'
}

export default function ListingDetail({ id, categories }) {
  const [listing, setListing] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let live = true
    setListing(null)
    setError(null)
    getListing(id)
      .then((data) => live && setListing(data))
      .catch((err) => live && setError(err))
    return () => {
      live = false
    }
  }, [id])

  if (error?.status === 404) {
    return (
      <section className="sm-empty">
        <h1 className="text-h2">Listing not found</h1>
        <p className="text-body sm-soft">
          There's no listing with id <code>{id}</code>. It may have been taken down.
        </p>
        <Button variant="tertiary" onClick={backToGrid}>
          Back to listings
        </Button>
      </section>
    )
  }
  if (error) {
    return (
      <p className="sm-error" role="alert">
        Couldn't load this listing: {error.message}
      </p>
    )
  }
  if (!listing) return <p className="sm-soft">Loading listing…</p>

  return (
    <article className="sm-detail">
      <div className="sm-detail-photo" aria-hidden="true">
        {listing.emoji}
      </div>
      <div className="sm-detail-body">
        <Badge color="denim">{categoryLabel(categories, listing.category)}</Badge>
        <div className="text-h1 sm-price">{formatPrice(listing.price)}</div>
        <h1 className="text-h3">{listing.title}</h1>
        <dl className="sm-facts">
          <dt>Condition</dt>
          <dd>{conditionLabel(listing.condition)}</dd>
          <dt>Seller</dt>
          <dd>{listing.seller}</dd>
          <dt>Location</dt>
          <dd>
            <Icon name="local" size={16} /> {listing.location}
          </dd>
          <dt>Posted</dt>
          <dd>
            <time dateTime={listing.postedAt}>{formatDate(listing.postedAt)}</time>
          </dd>
        </dl>
        <p className="text-body">{listing.description}</p>
        <Button variant="tertiary" onClick={backToGrid}>
          Back to listings
        </Button>
      </div>
    </article>
  )
}
