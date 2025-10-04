import { useState } from 'react'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home'
import Products from './pages/Products'
import './App.css'

function App() {

  return (
    <>
      <div className='layout'>
        <NavBar />
        {window.location.pathname.includes('/productos') || window.location.pathname.includes('/products') ? (
          <Products />
        ) : (
          <Home />
        )}
      </div>
    </>
  )
}

export default App
