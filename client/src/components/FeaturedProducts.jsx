import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../styles/Home.css';

// Variable de entorno para el despliegue
// Lee la variable VITE_API_URL de Vercel/Vite. Usa localhost como fallback.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const tryFetch = async (url) => {
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) throw new Error(`API responded ${res.status} when trying to access ${url}`);
          return await res.json();
        };

        let data;
        
        // CORRECCIÓN CLAVE: Determinamos la URL de la API.
        // Si API_URL existe (despliegue), la usamos. Si no (local), usamos la ruta relativa.
        // La ruta '/destacados' no existe, usamos '/productos' y luego filtramos.
        const apiUrlPath = API_URL === 'http://localhost:4000' ? '/api/productos' : `${API_URL}/api/productos`;


        // Intento 1: Ruta relativa primero (para desarrollo local)
        try {
          data = await tryFetch(apiUrlPath);
        } catch (err) {
          // Si falló (ej: error CORS en local con Vite), intentamos la URL completa (esto ya no debería ser necesario
          // si la lógica de apiUrlPath es correcta, pero la dejamos para robustez).
          // **NOTA:** La lógica de fetchAsJson simplificada en HeroBanner es mejor, pero aquí la mantendremos para consistencia con la lógica original.
          // El bloque try/catch interior queda obsoleto si usamos la lógica de HeroBanner, pero lo mantenemos simplificado así:
          data = await tryFetch(`${API_URL}/api/productos`);
        }


        // CORRECCIÓN: Tomamos solo los 4 primeros como "destacados"
        setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message || 'Error fetching products');
        setProducts([]); // Aseguramos que el estado sea un array vacío si falla
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
          // Usamos p._id (de Mongo) como key
          <ProductCard key={p._id || p.id} product={p} />
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