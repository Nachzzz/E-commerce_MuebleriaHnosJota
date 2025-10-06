import React from 'react';

const ProductCard = ({ product, onSelect, onAddToCart }) => {
  if (!product) return null;

  return (
    <article className="placa">
      <img src={product.imagen} alt={product.nombre} />
      <h2>{product.nombre}</h2>
      <h3>${product.precio.toLocaleString()}</h3>
      <p>{product.descripcion}</p>
      <button onClick={() => onSelect(product)}>Ver detalle</button>
      <button onClick={() => onAddToCart(product)}>Añadir al carrito</button>
    </article>
  );
};

export default ProductCard;


