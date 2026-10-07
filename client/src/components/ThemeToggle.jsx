import { useState } from 'react'
import { Button } from '../design-system'

const KEY = 'swapmeet-theme'

function readStored() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

// Called before first render so a stored choice applies without a flash.
// No stored choice → no attribute → the theme follows the OS.
export function applyStoredTheme() {
  const stored = readStored()
  if (stored) document.documentElement.dataset.theme = stored
}

function effectiveTheme() {
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(effectiveTheme)

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // storage blocked: the choice still applies for this visit
    }
    setTheme(next)
  }

  return (
    <Button variant="tertiary" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'Day' : 'Night'} theme`}>
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
      {theme === 'dark' ? 'Day' : 'Night'}
    </Button>
  )
}
