import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { show } = useContext(NotificationContext);
  const { isLoggedIn } = useAuthContext();

  if (!product) return null;

  const productId = product._id;

  // Manejador que si no está logeado para agregar un producto al carrito, te manda al login
  const handlerAgregarCarrito = () => {
    if (!isLoggedIn) { navigate('/login', { state: { from: '/productos' } }); return; }
    addToCart(product, 1); show(`Añadido: ${product.nombre}`)
  };


  return (
    <article className="placa">
      <img src={product.imagenUrl} alt={product.nombre} />
      <h2 className="negro">{product.nombre}</h2>
      <h3 className="marron">${product.precio.toLocaleString()}</h3>
      <p className="descripcion">{product.descripcion}</p>
      <Link className="btn-coleccion producto" to={`/productos/${productId}`}>Ver</Link>
      <button className="btn-carrito" onClick={handlerAgregarCarrito} aria-label={`Agregar ${product.nombre} al carrito`}>Agregar al carrito</button>
    </article>
  );
};

export default ProductCard;
