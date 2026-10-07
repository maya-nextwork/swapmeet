// Pill filter. Selection shows as fill plus a check mark and aria-pressed,
// so color never carries the state alone.
export default function CategoryFilter({ categories, value, onChange }) {
  const options = [{ id: null, label: 'All' }, ...(categories ?? [])]
  return (
    <div className="sm-filter" role="group" aria-label="Filter by category">
      {options.map((c) => {
        const selected = c.id === value
        return (
          <button
            key={c.id ?? 'all'}
            type="button"
            className="sm-pill"
            aria-pressed={selected}
            onClick={() => onChange(c.id)}
          >
            {selected && <span aria-hidden="true">✓ </span>}
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
