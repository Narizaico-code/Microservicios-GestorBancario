import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { ThemeProvider } from "@material-tailwind/react"
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../features/auth/store/authStore.js'
import '../style/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)