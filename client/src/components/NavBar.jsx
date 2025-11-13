import "../styles/NavBar.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import carritoIcon from '/carrito.svg'
import CartContext from '../context/CartContext'
import { useAuthContext } from '../context/AuthContext'
import { UserIcon } from 'lucide-react';

// Icono de usuario para el Perfil

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalCount } = useContext(CartContext) || { totalCount: 0 };
  
  // 2. Usar el contexto de autenticación
  const { isLoggedIn, user, logout } = useAuthContext();
  const navigate = useNavigate()

  // Función para cerrar sesión y redirigir
  const handleLogout = () => {
    logout();
    setMenuOpen(false); // Cierra el menú en móvil
    navigate('/');
  }

  // Elemento condicional para el botón de autenticación
  const AuthButtons = isLoggedIn ? (
    <>
      <li>
        {/* Muestra el nombre de usuario o "Perfil" */}
        <Link to="/perfil" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserIcon />
            {user?.username || 'Perfil'} 
        </Link>
      </li>
      <li>
        {/* Botón de Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="nav-link-button" // Usaremos una clase para estilizarlo como link
        >
          Cerrar Sesión
        </button>
      </li>
    </>
  ) : (
    <li>
      {/* Link de Ingresar */}
      <Link to="/login" onClick={() => setMenuOpen(false)}>Ingresar</Link>
    </li>
  );


  return (
    <header className="site-header">
      <nav className="nav">
        <div className="logo">
          <button className="logo-btn" onClick={() => navigate('/') } aria-label="Inicio">
            <img src="/logo.svg" alt="Logo Mueblería Jota Hnos" />
          </button>
        </div>

        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          </li>
          <li>
            <Link to="/productos" onClick={() => setMenuOpen(false)}>Productos</Link>
          </li>
          <li>
            <Link to="/nosotros" onClick={() => setMenuOpen(false)}>Nosotros</Link>
          </li>
          <li>
            <Link to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link>
          </li>
          {/* Renderizado Condicional aquí */}
          {AuthButtons} 
          <li>
            <button
              className="carrito-btn"
              aria-label={`Ver carrito, ${totalCount} items`}
              onClick={() => { navigate('/carrito'); setMenuOpen(false); }}
            >
              <img src={carritoIcon} alt="Carrito" className="carrito-icon" />
              <span className="contador-carrito">{totalCount}</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;