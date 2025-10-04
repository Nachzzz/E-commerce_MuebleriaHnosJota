import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../styles/Home.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/productos');
        if (!res.ok) throw new Error('API not available');
        const data = await res.json();
        setProducts(data.slice(0, 4));
      } catch (err) {
        // Llamada de respaldo al archivo JSON local. Se usaba antes para pruebas
        try {
          const res2 = await fetch('/data/productos.json');
          const data2 = await res2.json();
          setProducts(data2.slice(0, 4));
        } catch (err2) {
          console.error('Failed to load products', err2);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="placas-container">Cargando productos...</div>;

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
