import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const tryFetch = async (url) => {
          const r = await fetch(url, { cache: 'no-store' });
          if (!r.ok) throw new Error(`API responded ${r.status}`);
          return await r.json();
        };

        let data;
        try {
          data = await tryFetch('/api/productos');
        } catch {
          // fallback to explicit backend host
          data = await tryFetch('http://localhost:4000/api/productos');
        }

        setProducts(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
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
      list = list.filter((p) => (p.nombre || '').toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [products, category, query]);

  const categories = React.useMemo(() => {
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            role="search"
            className="buscador"
          >
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
            <button
              key={cat}
              className="btn-coleccion"
              onClick={() => setCategory(cat)}
            >
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
          //Usamos p._id (de Mongo) como key, en lugar de p.id
          filtered.map((p) => <ProductCard key={p._id || p.id} product={p} />)
        )}
      </div>
    </main>
  );
};

export default Products;