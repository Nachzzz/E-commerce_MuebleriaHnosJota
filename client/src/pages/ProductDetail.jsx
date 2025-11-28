import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Products.css';
import '../styles/ProductDetail.css';
import CartContext from '../context/CartContext';
import NotificationContext from '../context/NotificationContext';
// Importamos AuthContext para condicionales de renderizado
import { useAuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { show } = useContext(NotificationContext);
  
  // Obtenemos user para saber si mostrar el botón
  const { user } = useAuthContext(); 
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_URL}/api/productos/${id}`);
            if (!res.ok) throw new Error('Error al cargar producto');
            const data = await res.json();
            setProducto(data);
        } catch (err) {
            console.error(err);
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

  const handleConfirmDelete = async () => {
    try {
      // 1. LEER TOKEN DIRECTAMENTE DE LOCALSTORAGE (Infalible)
      const storedToken = localStorage.getItem('userToken');

      // Debug para verificar en consola
      console.log("Token recuperado de localStorage:", storedToken);

      if (!storedToken) {
        show("Sesión expirada. Por favor, inicia sesión.");
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // 2. Enviamos el header Authorization correctamente
            'Authorization': `Bearer ${storedToken}` 
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: No se pudo eliminar.`);
      }

      show('Producto eliminado correctamente.');
      navigate('/productos');

    } catch (err) {
      console.error('Error al eliminar:', err);
      show(`Error: ${err.message}`);
      setIsDeleting(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <main className="product-detail">
      <button onClick={() => navigate('/productos')}>⬅ Volver al catálogo</button>
      <h1>{producto.nombre}</h1>
      
      <img src={producto.imagenUrl || producto.imagen} alt={producto.nombre} className="detalle-imagen" />
      
      <p>{producto.descripcion1 || producto.descripcion}</p>
      <p><strong>Precio:</strong> ${producto.precio?.toLocaleString()}</p>
      {producto.material && <p><strong>Material:</strong> {producto.material}</p>}
      {producto.medidas && <p><strong>Medidas:</strong> {producto.medidas}</p>}
      {producto.acabado && <p><strong>Acabado:</strong> {producto.acabado}</p>}
      {producto.tiempo && <p><strong>Tiempo de entrega:</strong> {producto.tiempo}</p>}

      <button className="btn-primary" onClick={() => handleAddToCart(producto)}>🛒 Añadir al Carrito</button>

      {/* SECCIÓN ADMIN: Visible solo si es admin */}
      {user && user.role === 'admin' && (
          <div className="admin-actions">
            <button 
                className="btn-secondary" 
                style={{marginBottom: '10px', width: '100%', borderColor: '#A0522D', color: '#A0522D'}}
                onClick={() => navigate(`/admin/editar-producto/${id}`)}
            >
                ✏️ Editar Producto
            </button>
            {!isDeleting ? (
              <button className="btn-danger" onClick={() => setIsDeleting(true)}>
                Eliminar Producto (Admin)
              </button>
            ) : (
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
      )}
    </main>
  );
}