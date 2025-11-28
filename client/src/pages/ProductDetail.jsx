import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Products.css';
import '../styles/ProductDetail.css';
import CartContext from '../context/CartContext';
import NotificationContext from '../context/NotificationContext';
import { useAuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { show } = useContext(NotificationContext);
  const { user } = useAuthContext(); // Usamos user para mostrar form o login

  // Estados del Producto
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados de las Reseñas
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Cargar Producto
            const resProd = await fetch(`${API_URL}/api/productos/${id}`);
            if (!resProd.ok) throw new Error('Error al cargar producto');
            const dataProd = await resProd.json();
            setProducto(dataProd);

            // 2. Cargar Reseñas
            const resReviews = await fetch(`${API_URL}/api/productos/${id}/reviews`);
            if (resReviews.ok) {
                const dataReviews = await resReviews.json();
                setReviews(dataReviews);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = (p) => {
    addToCart(p, 1);
    show(`Añadido: ${p.nombre}`);
  };

  // Manejador para borrar producto (Admin)
  const handleConfirmDelete = async () => {
    try {
      const storedToken = localStorage.getItem('userToken');
      if (!storedToken) {
        show("Sesión expirada. Inicia sesión.");
        return navigate('/login');
      }

      const response = await fetch(`${API_URL}/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}` 
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar.');
      }

      show('Producto eliminado correctamente.');
      navigate('/productos');
    } catch (err) {
      console.error('Error delete:', err);
      show(`Error: ${err.message}`);
      setIsDeleting(false);
    }
  };

  // Manejador para enviar reseña
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem('userToken');
    
    if (!storedToken) {
        return navigate('/login', { state: { from: `/productos/${id}` } });
    }

    setSubmittingReview(true);
    try {
        const res = await fetch(`${API_URL}/api/productos/${id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({ rating, comment })
        });

        const data = await res.json();

        if (res.ok) {
            show('¡Gracias por tu opinión!');
            setComment('');
            setRating(5);
            // Recargar reseñas y producto (para actualizar promedio)
            const newReviews = await fetch(`${API_URL}/api/productos/${id}/reviews`).then(r => r.json());
            setReviews(newReviews);
            // Opcional: Recargar producto si quieres ver el promedio actualizado al instante
        } else {
            show(data.msg || 'Error al enviar reseña');
        }
    } catch (err) {
        show('Error de conexión');
    } finally {
        setSubmittingReview(false);
    }
  };

  if (loading) return <p style={{padding:'20px'}}>Cargando...</p>;
  if (!producto) return <p style={{padding:'20px'}}>Producto no encontrado.</p>;

  return (
    <main className="product-detail">
      <button className="btn-back" onClick={() => navigate('/productos')}>⬅ Volver</button>
      
      {/* SECCIÓN SUPERIOR: DETALLES */}
      <div className="detail-container">
          <div className="image-col">
            <img src={producto.imagenUrl || producto.imagen} alt={producto.nombre} />
          </div>
          
          <div className="info-col">
            <h1>{producto.nombre}</h1>
            <div className="valoracion-estrellas" title={`Promedio: ${producto.valoracion || 0}`}>
                {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{color: i < (producto.valoracion || 5) ? '#D4A437' : '#ddd'}}>★</span>
                ))}
                <span style={{fontSize:'0.8rem', color:'#666', marginLeft:'5px'}}>
                    ({reviews.length} opiniones)
                </span>
            </div>

            <p className="price">${producto.precio?.toLocaleString()}</p>
            <p className="description">{producto.descripcion1 || producto.descripcion}</p>
            
            <div className="specs">
                {producto.material && <p><strong>Material:</strong> {producto.material}</p>}
                {producto.medidas && <p><strong>Medidas:</strong> {producto.medidas}</p>}
                {producto.tiempo && <p><strong>Entrega:</strong> {producto.tiempo}</p>}
                <p><strong>Stock:</strong> {producto.stock > 0 ? `${producto.stock} unidades` : 'Sin stock'}</p>
            </div>

            <button 
                className="btn-primary" 
                onClick={() => handleAddToCart(producto)}
                disabled={producto.stock <= 0}
                style={{opacity: producto.stock <= 0 ? 0.5 : 1}}
            >
                {producto.stock > 0 ? '🛒 Añadir al Carrito' : 'Agotado'}
            </button>

            {/* Admin Actions */}
            {user && user.role === 'admin' && (
                <div className="admin-actions">
                    <button 
                        className="btn-secondary btn-edit"
                        onClick={() => navigate(`/admin/editar-producto/${id}`)}
                    >
                        ✏️ Editar
                    </button>
                    
                    {!isDeleting ? (
                    <button className="btn-danger" onClick={() => setIsDeleting(true)}>
                        🗑️ Eliminar
                    </button>
                    ) : (
                    <div className="confirmation-dialog">
                        <p>¿Seguro?</p>
                        <button className="btn-danger" onClick={handleConfirmDelete}>Si</button>
                        <button className="btn-secondary" onClick={() => setIsDeleting(false)}>No</button>
                    </div>
                    )}
                </div>
            )}
          </div>
      </div>

      {/* SECCIÓN INFERIOR: RESEÑAS */}
      <section className="reviews-section">
        <h2>Opiniones de Clientes</h2>
        
        {/* Formulario */}
        <div className="review-form-container">
            {user ? (
                <form onSubmit={handleSubmitReview} className="review-form">
                    <h3>Escribe tu opinión</h3>
                    <div className="rating-select">
                        <label>Calificación:</label>
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            <option value="5">5 - Excelente</option>
                            <option value="4">4 - Muy bueno</option>
                            <option value="3">3 - Bueno</option>
                            <option value="2">2 - Regular</option>
                            <option value="1">1 - Malo</option>
                        </select>
                    </div>
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comparte tu experiencia con este mueble..."
                        required
                        rows="3"
                    />
                    <button type="submit" disabled={submittingReview}>
                        {submittingReview ? 'Enviando...' : 'Publicar Reseña'}
                    </button>
                </form>
            ) : (
                <div className="login-prompt">
                    <p>¿Compraste este producto? <span onClick={() => navigate('/login', { state: { from: `/productos/${id}` } })} className="link-login">Inicia sesión</span> para dejar tu opinión.</p>
                </div>
            )}
        </div>

        {/* Lista de Reseñas */}
        <div className="reviews-list">
            {reviews.length === 0 ? (
                <p className="no-reviews">Aún no hay opiniones. ¡Sé el primero!</p>
            ) : (
                reviews.map(rev => (
                    <div key={rev._id} className="review-card">
                        <div className="review-header">
                            <div className="avatar-small">{rev.username.charAt(0).toUpperCase()}</div>
                            <div>
                                <span className="review-user">{rev.username}</span>
                                <div className="review-stars">
                                    {Array.from({length:5}, (_,i) => (
                                        <span key={i} style={{color: i < rev.rating ? '#D4A437' : '#eee'}}>★</span>
                                    ))}
                                </div>
                            </div>
                            <span className="review-date">
                                {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="review-comment">{rev.comment}</p>
                    </div>
                ))
            )}
        </div>
      </section>
    </main>
  );
}