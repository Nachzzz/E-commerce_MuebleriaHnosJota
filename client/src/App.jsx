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
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Checkout from './pages/Checkout'
import Perfil from './pages/Perfil.jsx'

function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <AuthProvider>
        <div className='layout'>
          <NavBar />
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/perfil" element={<Perfil />} />

            {/* Rutas Protegidas - Solo para administradores */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/crear-producto" element={<CrearProducto />} />
                <Route path="/admin/editar-producto/:id" element={<CrearProducto />} />
            </Route>

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