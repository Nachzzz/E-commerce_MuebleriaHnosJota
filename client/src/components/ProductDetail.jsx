import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Products.css';
import '../styles/ProductDetail.css';
import CartContext from '../context/CartContext';
import NotificationContext from '../context/NotificationContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { show } = useContext(NotificationContext);

  // 1. Nuevo estado para manejar la confirmación de borrado
  const [isDeleting, setIsDeleting] = useState(false);

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
    addToCart(p, 1);
    show(`Añadido: ${p.nombre}`);
  };

  // 2. Nueva función para manejar el borrado
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto.');
      }

      show('Producto eliminado correctamente.');
      navigate('/productos');

    } catch (err) {
      console.error('Error al eliminar:', err);
      show('Error al eliminar el producto.');
      setIsDeleting(false);
    }
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
      
      {/* Usamos 'imagenUrl' (de Mongo) */}
      <img src={producto.imagenUrl} alt={producto.nombre} className="detalle-imagen" />
      
      <p>{producto.descripcion1}</p>
      <p><strong>Precio:</strong> ${producto.precio.toLocaleString()}</p>
      {producto.material && <p><strong>Material:</strong> {producto.material}</p>}
      {producto.medidas && <p><strong>Medidas:</strong> {producto.medidas}</p>}
      {producto.acabado && <p><strong>Acabado:</strong> {producto.acabado}</p>}
      {producto.tiempo && <p><strong>Tiempo de entrega:</strong> {producto.tiempo}</p>}

      <button className="btn-primary" onClick={() => handleAddToCart(producto)}>🛒 Añadir al Carrito</button>

      {/* 3. Nuevos elementos JSX para el borrado y confirmación */}
      <div className="admin-actions">
        {!isDeleting ? (
          // Botón principal de Eliminar
          <button className="btn-danger" onClick={() => setIsDeleting(true)}>
            Eliminar Producto (Admin)
          </button>
        ) : (
          // Diálogo de confirmación
          <div className="confirmation-dialog">
            <p>¿Estás seguro de que quieres eliminar este producto?</p>
            <button className="btn-danger" onClick={handleConfirmDelete}>
              Sí, eliminar
            </button>
            <button className="btn-secondary" onClick={() => setIsDeleting(false)}>
              Cancelar
            </button>
          </div>
        )}
      </div>
    </main>
  );
}