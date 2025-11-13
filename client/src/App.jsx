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
import Registro from './pages/Registro.jsx'
import Login from './pages/Login.jsx'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles/toasts.css'
import './App.css'

function App() {

  return (
    <NotificationProvider>
      <CartProvider>
        <AuthProvider>
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
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/perfil" element={<p style={{margin: '3rem'}}>Página de Perfil del Usuario: {user?.username}</p>} /> */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
        </AuthProvider>
      </CartProvider>
    </NotificationProvider>
  )
}

export default App

