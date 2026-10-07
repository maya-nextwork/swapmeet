import { Button, Icon } from '../design-system'
import ThemeToggle from './ThemeToggle.jsx'

export default function Header({ route }) {
  return (
    <header className="sm-header">
      <a href="#/" className="sm-brand">
        SwapMeet
      </a>
      <nav className="sm-header-actions">
        {route.name !== 'sell' && (
          <Button variant="tertiary" onClick={() => (window.location.hash = '#/sell')}>
            <Icon name="sell" size={18} />
            Sell an item
          </Button>
        )}
        <ThemeToggle />
      </nav>
    </header>
  )
}
