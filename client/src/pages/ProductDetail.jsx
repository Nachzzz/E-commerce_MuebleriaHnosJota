import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Products.css';
import '../styles/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const tryFetch = async (url) => {
          const r = await fetch(url, { cache: 'no-store' });
          if (!r.ok) throw new Error(`API responded ${r.status}`);
          return await r.json();
        };

        let data;
        try {
          data = await tryFetch(`/api/productos/${id}`);
        } catch (err) {
          data = await tryFetch(`http://localhost:4000/api/productos/${id}`);
        }

        setProducto(data);
      } catch (err) {
        console.error('Error fetching product', err);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (p) => {
    // placeholder: in real app you'd update context/global state
    console.log('Añadir al carrito', p);
    // navigate('/carrito')
  };

  if (loading) return <p>Cargando...</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <main className="product-detail">
      <button onClick={() => navigate('/productos')}>⬅ Volver al catálogo</button>
      <h1>{producto.nombre}</h1>
      <div className="valoracion-estrellas">
        <h2>Valoracion</h2>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < (producto.valoracion ?? 5) ? '★' : '☆'}</span>
        ))}
      </div>
      <img src={producto.imagen} alt={producto.nombre} className="detalle-imagen" />
      
      <p>{producto.descripcion1}</p>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      {producto.material && <p><strong>Material:</strong> {producto.material}</p>}
      {producto.medidas && <p><strong>Medidas:</strong> {producto.medidas}</p>}
      {producto.acabado && <p><strong>Acabado:</strong> {producto.acabado}</p>}
      {producto.tiempo && <p><strong>Tiempo de entrega:</strong> {producto.tiempo}</p>}

      <button className="btn-primary" onClick={() => handleAddToCart(producto)}>🛒 Añadir al Carrito</button>
    </main>
  );
}
