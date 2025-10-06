import React from 'react';
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    <article className="placa">
      <img src={product.imagen} alt={product.nombre} />
      <h2 className="negro">{product.nombre}</h2>
      <h3 className="marron">${product.precio.toLocaleString()}</h3>
      <p className="descripcion">{product.descripcion}</p>
      <a className="btn-coleccion producto" href={`/producto/${product.id}`}>Ver</a>
      <Link to={`/producto/${product.id}`}>
        <button className="btn-ver-mas">Ver más</button>
      </Link>
    </article>
  );
};

export default ProductCard;
