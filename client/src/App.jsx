import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail' 
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import Carrito from './pages/Carrito'
import CrearProducto from './pages/CrearProducto' 
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationContext'
import './styles/toasts.css'
import './App.css'

function App() {

  return (
    <NotificationProvider>
      <CartProvider>
        <div className='layout'>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/productos" element={<Products />} />
            {/* Ruta corregida a plural */}
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Carrito />} />
            {/* Nueva ruta de Admin añadida */}
            <Route path="/admin/crear-producto" element={<CrearProducto />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </CartProvider>
    </NotificationProvider>
  )
}

export default App

