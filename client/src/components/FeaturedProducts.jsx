import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../styles/Home.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const tryFetch = async (url) => {
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) throw new Error(`API responded ${res.status}`);
          return await res.json();
        };

        let data;
        try {
          data = await tryFetch('/api/productos/destacados');
        } catch (err) {
          // fallback to explicit backend host
          data = await tryFetch('http://localhost:4000/api/productos/destacados');
        }

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="placas-container">Cargando productos...</div>;
  if (error) return <div className="placas-container">Error cargando productos: {error}</div>;

  return (
    <section className="productos-destacados">
      <div className="info_productos">
        <h2>CADA PIEZA CUENTA UNA HISTORIA</h2>
        <h1 className="col_actual">Colección Actual</h1>
        <p>
          Descubrir la calidez del optimismo de los años 60 se encuentra con la conciencia de la
          <br /> sustentabilidad del 2025 en cada pieza única.
        </p>
      </div>

      <div className="placas-container" id="destacados-home">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="coleccion">
        <button className="btn-coleccion especial">
          <a className="links" href="/productos">Explorar Toda la Colección</a>
        </button>
      </div>
    </section>
  );
};

export default FeaturedProducts;
