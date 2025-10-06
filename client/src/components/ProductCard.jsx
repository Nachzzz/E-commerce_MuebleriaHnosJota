import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import NotificationContext from '../context/NotificationContext';


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { show } = useContext(NotificationContext);
  if (!product) return null;

  return (
    <article className="placa">
      <img src={product.imagen} alt={product.nombre} />
      <h2 className="negro">{product.nombre}</h2>
      <h3 className="marron">${product.precio.toLocaleString()}</h3>
      <p className="descripcion">{product.descripcion}</p>
  <Link className="btn-coleccion producto" to={`/producto/${product.id}`}>Ver</Link>
  <button className="btn-carrito" onClick={() => { addToCart(product, 1); show(`Añadido: ${product.nombre}`); }} aria-label={`Agregar ${product.nombre} al carrito`}>Agregar al carrito</button>
    </article>
  );
};

export default ProductCard;
