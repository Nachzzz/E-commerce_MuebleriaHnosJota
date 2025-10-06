import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  if (!product) return null;

  return (
    <article className="placa">
      <img src={product.imagen} alt={product.nombre} />
      <h2 className="negro">{product.nombre}</h2>
      <h3 className="marron">${product.precio.toLocaleString()}</h3>
      <p className="descripcion">{product.descripcion}</p>
      <Link className="btn-coleccion producto" to={`/producto/${product.id}`}>Ver</Link>
      <button className="btn-carrito" onClick={() => { console.log('Agregar', product); navigate('/carrito'); }}>Agregar al carrito</button>
    </article>
  );
};

export default ProductCard;
