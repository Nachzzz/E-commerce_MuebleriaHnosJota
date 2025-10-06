import { useState } from 'react';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home';
import Products from './pages/Products.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import './App.css';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  return (
    <>
      <NavBar cartCount={carrito.length} />

      {productoSeleccionado ? (
        <ProductDetail
          producto={productoSeleccionado}
          onAddToCart={(p) => setCarrito([...carrito, p])}
          onVolver={() => setProductoSeleccionado(null)}
        />
      ) : window.location.pathname.includes('/productos') ? (
        <Products
          setProductoSeleccionado={setProductoSeleccionado}
          onAddToCart={(p) => setCarrito([...carrito, p])}
        />
      ) : (
        <Home />
      )}
    </>
  );
}

export default App;




