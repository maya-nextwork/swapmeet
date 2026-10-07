import { useState } from 'react'
import { ApiError, createListing } from '../api.js'
import { Button } from '../design-system'
import { CONDITIONS } from './format.js'

const EMPTY = {
  title: '',
  price: '',
  category: '',
  condition: '',
  description: '',
  seller: '',
  location: '',
  emoji: ''
}

// Mirrors the POST /api/listings rules so most mistakes are caught before
// the request. The server stays the authority: its 400 fields show inline too.
function validate(v, categories) {
  const e = {}
  const len = (k, min, max, name) => {
    const n = v[k].trim().length
    if (n === 0) e[k] = `${name} is required.`
    else if (n < min) e[k] = `${name} must be at least ${min} characters.`
    else if (n > max) e[k] = `${name} must be ${max} characters or fewer.`
  }
  len('title', 3, 80, 'Title')
  if (v.price.trim() === '') e.price = 'Price is required.'
  else if (!/^\d+$/.test(v.price.trim())) e.price = 'Price must be a whole number of dollars.'
  else if (Number(v.price) > 1000000) e.price = 'Price must be $1,000,000 or less.'
  if (!categories?.some((c) => c.id === v.category)) e.category = 'Pick a category.'
  if (!CONDITIONS.some((c) => c.id === v.condition)) e.condition = 'Pick a condition.'
  len('description', 1, 1000, 'Description')
  len('seller', 1, 60, 'Seller name')
  len('location', 1, 60, 'Location')
  return e
}

function Field({ id, label, hint, error, children }) {
  return (
    <div className="sm-field">
      <label htmlFor={id} className="sm-label">
        {label}
        {hint && <span className="sm-hint"> {hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="sm-field-error">
          {error}
        </p>
      )}
    </div>
  )
}

export default function PostListingForm({ categories }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (ev) => setValues({ ...values, [k]: ev.target.value })
  const a11y = (k) => ({
    id: `f-${k}`,
    name: k,
    value: values[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `f-${k}-error` : undefined
  })

  async function onSubmit(ev) {
    ev.preventDefault()
    setFormError(null)
    const clientErrors = validate(values, categories)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) return

    const payload = {
      title: values.title.trim(),
      price: Number(values.price.trim()),
      category: values.category,
      condition: values.condition,
      description: values.description.trim(),
      seller: values.seller.trim(),
      location: values.location.trim()
    }
    if (values.emoji.trim()) payload.emoji = values.emoji.trim()

    setSubmitting(true)
    try {
      const created = await createListing(payload)
      window.location.hash = `#/listings/${created.id}`
    } catch (err) {
      if (err instanceof ApiError && err.status === 400 && err.body?.fields) {
        setErrors(err.body.fields)
        setFormError('The server could not accept this listing. Check the fields marked below.')
      } else {
        setFormError(`Couldn't post the listing: ${err.message}`)
      }
      setSubmitting(false)
    }
  }

  return (
    <section className="sm-form-wrap">
      <h1 className="text-h1 sm-page-title">Sell an item</h1>
      <p className="text-body sm-soft">Every field is required unless marked optional.</p>

      {formError && (
        <p className="sm-error" role="alert">
          {formError}
        </p>
      )}

      <form className="sm-form" onSubmit={onSubmit} noValidate>
        <Field id="f-title" label="Title" error={errors.title}>
          <input className="sm-input" type="text" maxLength={80} {...a11y('title')} />
        </Field>
        <Field id="f-price" label="Price" hint="(whole dollars)" error={errors.price}>
          <input className="sm-input" type="text" inputMode="numeric" {...a11y('price')} />
        </Field>
        <Field id="f-category" label="Category" error={errors.category}>
          <select className="sm-input" {...a11y('category')}>
            <option value="">Choose a category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="f-condition" label="Condition" error={errors.condition}>
          <select className="sm-input" {...a11y('condition')}>
            <option value="">Choose a condition</option>
            {CONDITIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="f-description" label="Description" error={errors.description}>
          <textarea className="sm-input" rows={5} maxLength={1000} {...a11y('description')} />
        </Field>
        <Field id="f-seller" label="Seller name" error={errors.seller}>
          <input className="sm-input" type="text" maxLength={60} {...a11y('seller')} />
        </Field>
        <Field id="f-location" label="Location" hint="(neighborhood)" error={errors.location}>
          <input className="sm-input" type="text" maxLength={60} {...a11y('location')} />
        </Field>
        <Field id="f-emoji" label="Emoji" hint="(optional, defaults to 📦)" error={errors.emoji}>
          <input className="sm-input sm-input-short" type="text" {...a11y('emoji')} />
        </Field>

        <div className="sm-form-actions">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Posting…' : 'Post listing'}
          </Button>
          <Button variant="tertiary" onClick={() => (window.location.hash = '#/')}>
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}
