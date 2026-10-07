import React from 'react'
import ReactDOM from 'react-dom/client'
import './design-system/tokens.css'
import './components/app.css'
import App from './App.jsx'
import { applyStoredTheme } from './components/ThemeToggle.jsx'

applyStoredTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
