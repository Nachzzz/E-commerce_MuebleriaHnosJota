import "../styles/NavBar.css";
import { useState } from "react";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0); // replace with real state later

  return (
    <header className="site-header">
      <nav className="nav">
        <div className="logo">
          <a href="/">
            <img src="/logo.svg" alt="Logo Mueblería Jota Hnos" />
          </a>
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
            <a href="/">Inicio</a>
          </li>
          <li>
            <a href="/productos">Productos</a>
          </li>
          <li>
            <a href="/nosotros">Nosotros</a>
          </li>
          <li>
            <a href="/contacto">Contacto</a>
          </li>
          <li>
            <button className="carrito-btn" aria-label={`Ver carrito, ${cartCount} items`}>
              <img src="assets/carrito.svg" alt="carrito" />
              <span className="contador-carrito">{cartCount}</span>
              <a href="/carrito">Carrito</a>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;