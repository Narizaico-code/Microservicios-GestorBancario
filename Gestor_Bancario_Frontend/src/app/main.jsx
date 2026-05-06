import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import { App } from './App.jsx'
import { ThemeProvider } from "@material-tailwind/react"
import { BrowserRouter } from 'react-router-dom'
import '../style/index.css'
=======
import { ThemeProvider } from '@material-tailwind/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../features/auth/store/authStore.js'
import '../style/index.css'
import { App } from './App.jsx'
>>>>>>> f28a5200080534d21ee33e7e2e3039127cfb24e0

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
<<<<<<< HEAD
        <App />
=======
        <AuthProvider>
          <App />
        </AuthProvider>
>>>>>>> f28a5200080534d21ee33e7e2e3039127cfb24e0
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
