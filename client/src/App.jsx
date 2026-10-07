import { useEffect, useState } from 'react'
import { getCategories } from './api.js'
import { Button } from './design-system'
import Header from './components/Header.jsx'
import ListingGrid from './components/ListingGrid.jsx'
import ListingDetail from './components/ListingDetail.jsx'
import PostListingForm from './components/PostListingForm.jsx'

// Hash routes, no router dependency: #/ grid, #/listings/:id detail, #/sell form.
function parseHash(hash) {
  const path = hash.replace(/^#/, '') || '/'
  if (path === '/') return { name: 'grid' }
  if (path === '/sell') return { name: 'sell' }
  const m = path.match(/^\/listings\/([^/]+)$/)
  if (m) return { name: 'detail', id: decodeURIComponent(m[1]) }
  return { name: 'missing' }
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  const [categories, setCategories] = useState(null)
  // Lives here so the filter survives a trip to a detail page and back.
  const [category, setCategory] = useState(null)

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  return (
    <>
      <Header route={route} />
      <main className="sm-main">
        {route.name === 'grid' && (
          <ListingGrid categories={categories} category={category} onCategoryChange={setCategory} />
        )}
        {route.name === 'detail' && <ListingDetail key={route.id} id={route.id} categories={categories} />}
        {route.name === 'sell' && <PostListingForm categories={categories} />}
        {route.name === 'missing' && (
          <section className="sm-empty">
            <h1 className="text-h2">Page not found</h1>
            <Button variant="tertiary" onClick={() => (window.location.hash = '#/')}>
              Back to listings
            </Button>
          </section>
        )}
      </main>
    </>
  )
}
