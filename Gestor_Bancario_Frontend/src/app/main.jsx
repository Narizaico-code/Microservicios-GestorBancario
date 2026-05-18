import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { ThemeProvider as MaterialThemeProvider } from "@material-tailwind/react"
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../features/auth/store/authStore.js'
import { ThemeProvider as AppThemeProvider } from '../shared/store/themeStore.js'
import '../style/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MaterialThemeProvider>
      <AppThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </AppThemeProvider>
    </MaterialThemeProvider>
  </StrictMode>,
)