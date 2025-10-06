import "../styles/NavBar.css";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import carritoIcon from '../assets/carrito.svg'

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const navigate = useNavigate()

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
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/productos">Productos</Link>
          </li>
          <li>
            <Link to="/nosotros">Nosotros</Link>
          </li>
          <li>
            <Link to="/contacto">Contacto</Link>
          </li>
          <li>
            <button
              className="carrito-btn"
              aria-label={`Ver carrito, ${cartCount} items`}
              onClick={() => navigate('/carrito')}
            >
              <img src={carritoIcon} alt="Carrito" className="carrito-icon" />
              <span className="contador-carrito">{cartCount}</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;