import "../styles/NavBar.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import carritoIcon from '/carrito.svg'
import carritoIconWhite from '/carrito_blanco.svg'
import CartContext from '../context/CartContext'
import { useAuthContext } from '../context/AuthContext'
import { LogOut, Package, Heart, Settings, HouseHeart, Armchair, Handshake, Mail, CircleUser } from 'lucide-react';


const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para el menú desplegable
  const { totalCount } = useContext(CartContext) || { totalCount: 0 };

  const { isLoggedIn, user, logout } = useAuthContext();
  const navigate = useNavigate()

  //funcion para cambiar el img del carrito cuando paso el cursor por encima
  const [isHovered, setIsHovered] = useState(false);

  // Función para cerrar sesión y redirigir
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  }

  // Función para alternar el dropdown y cerrar el menú móvil si está abierto
  const toggleDropdown = () => {
    setDropdownOpen(v => !v);
    if (menuOpen) setMenuOpen(false);
  }

  // Elemento condicional para el botón de autenticación
  const AuthButtons = isLoggedIn ? (
    <li className="profile-dropdown-container">
      <button
        onClick={toggleDropdown}
        className={`profile-btn ${dropdownOpen ? 'active' : ''}`}
        aria-label={`Ver perfil de ${user?.username || 'Usuario'}`}
      >
        <CircleUser size={18} />
        {user?.username || 'Perfil'}
      </button>

      {/* Menú Desplegable */}
      {dropdownOpen && (
        <div className="profile-dropdown-menu">
          <div className="user-info-header">
            <p className="user-name-text">{user?.username}</p>
            <p className="user-email-text">{user?.email}</p>
          </div>

          <Link to="/perfil" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
            <CircleUser size={18} /> Mi Perfil
          </Link>
          <Link to="/pedidos" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
            <Package size={18} /> Mis Pedidos
          </Link>
          <Link to="/favoritos" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
            <Heart size={18} /> Favoritos
          </Link>
          <Link to="/configuracion" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
            <Settings size={18} /> Configuración
          </Link>

          <button onClick={handleLogout} className="dropdown-item logout-btn">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      )}
    </li>
  ) : (
    <li className="btn-ingresar">
      <Link to="/login" onClick={() => setMenuOpen(false)}>Ingresar</Link>
    </li>
  );


  return (
    <header className="site-header">
      <nav className="nav">
        <div className="logo">
          <button className="logo-btn" onClick={() => navigate('/')} aria-label="Inicio">
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
            <Link to="/" onClick={() => setMenuOpen(false)}> <HouseHeart size={18} /> Inicio</Link>
          </li>
          <li>
            <Link to="/productos" onClick={() => setMenuOpen(false)}><Armchair size={18} /> Productos</Link>
          </li>
          <li>
            <Link to="/nosotros" onClick={() => setMenuOpen(false)}><Handshake size={18} /> Nosotros</Link>
          </li>
          <li>
            <Link to="/contacto" onClick={() => setMenuOpen(false)}><Mail size={18} /> Contacto</Link>
          </li>

          {AuthButtons}

          <li>
            <button
              className="carrito-btn"
              aria-label={`Ver carrito, ${totalCount} items`}
              onClick={() => { navigate('/carrito'); setMenuOpen(false); }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img src={isHovered ? carritoIconWhite : carritoIcon} alt="Carrito" className="carrito-icon" />
              <span className="contador-carrito">{totalCount}</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;