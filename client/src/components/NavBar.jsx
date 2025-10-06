import "../styles/NavBar.css";
import { useState } from "react";

const NavBar = ({ cartCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="nav">
        <div className="logo">
          <a href="/"><img src="/logo.svg" alt="Logo" /></a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><a href="/">Inicio</a></li>
          <li><a href="/productos">Productos</a></li>
          <li>
            <button className="carrito-btn">
              🛒 <span>{cartCount}</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
