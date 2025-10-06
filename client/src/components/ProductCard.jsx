import React from 'react';
<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
import { Link, useNavigate } from 'react-router-dom';
>>>>>>> 2072ee5a1caf60d1febe375f030dc4d9a1ef5724

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  if (!product) return null;

  return (
    <article className="placa">
      <img src={product.imagen} alt={product.nombre} />
      <h2 className="negro">{product.nombre}</h2>
      <h3 className="marron">${product.precio.toLocaleString()}</h3>
      <p className="descripcion">{product.descripcion}</p>
<<<<<<< HEAD
      <a className="btn-coleccion producto" href={`/producto/${product.id}`}>Ver</a>
      <Link to={`/producto/${product.id}`}>
        <button className="btn-ver-mas">Ver más</button>
      </Link>
=======
      <Link className="btn-coleccion producto" to={`/producto/${product.id}`}>Ver</Link>
      <button className="btn-carrito" onClick={() => { console.log('Agregar', product); navigate('/carrito'); }}>Agregar al carrito</button>
>>>>>>> 2072ee5a1caf60d1febe375f030dc4d9a1ef5724
    </article>
  );
};

export default ProductCard;
