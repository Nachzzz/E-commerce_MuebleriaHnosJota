import React, { useEffect, useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

const Products = ({ setProductoSeleccionado, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/productos');
        if (!res.ok) throw new Error('API not available');
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        try {
          const res2 = await fetch('/data/productos.json');
          const data2 = await res2.json();
          setProducts(data2);
          setFiltered(data2);
        } catch (err2) {
          console.error('Failed to load products', err2);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let list = products;
    if (category && category !== 'Todos') {
      list = list.filter((p) => p.tipo && p.tipo.toLowerCase().includes(category.toLowerCase()));
    }
    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          (p.nombre || '').toLowerCase().includes(q) ||
          (p.descripcion || '').toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [products, category, query]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.tipo).filter(Boolean));
    return ['Todos', ...Array.from(set)];
  }, [products]);

  return (
    <main>
      <div className="titulo-product">
        <h2>COLECCION COMPLETA 2025</h2>
        <h1>
          <span className="negro">Muebles que cuentan </span> <br />
          <span className="marron"> historias </span>
        </h1>
        <p>
          Cada pieza de nuestra coleccion es el resultado de mas de 30 años de tradicion
          <br /> artesanal, donde la herencia se encuentra con la innovacion para crear muebles que
          <br /> el alma
        </p>
      </div>

      <div className="buscar-product">
        <div className="buscador-product">
          <form onSubmit={(e) => e.preventDefault()} role="search" className="buscador">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">🔎</button>
          </form>
        </div>

        <div className="coleccion1">
          {categories.map((cat) => (
            <button key={cat} className="btn-coleccion" onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div id="catalogo" className="placas-container1">
        {loading ? (
          <p>Cargando productos...</p>
        ) : filtered.length === 0 ? (
          <p>No se encontraron productos</p>
        ) : (
          filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => setProductoSeleccionado(p)} // detalle
              onAddToCart={() => onAddToCart(p)} // carrito
            />
          ))
        )}
      </div>
    </main>
  );
};

export default Products;

