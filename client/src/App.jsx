import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import Carrito from './pages/Carrito'
import { CartProvider } from './context/CartContext'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <CartProvider>
        <div className='layout'>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
