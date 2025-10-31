import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 1. Importar BrowserRouter
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Envolver la App con el Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

