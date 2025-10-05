import React from "react";

export default function ProductDetail({ producto, onAddToCart, onVolver }) {
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <div className="product-detail">
      <button onClick={onVolver}>⬅ Volver al catálogo</button>
      <h2>{producto.nombre}</h2>
      <img src={producto.imagen} alt={producto.nombre} className="detalle-imagen" />
      <div className="valoracion-estrellas">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < (producto.valoracion ?? 5) ? "★" : "☆"}</span>
        ))}
      </div>
      <p>{producto.descripcion}</p>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      {producto.material && <p><strong>Material:</strong> {producto.material}</p>}
      {producto.medidas && <p><strong>Medidas:</strong> {producto.medidas}</p>}
      {producto.acabado && <p><strong>Acabado:</strong> {producto.acabado}</p>}

      <button onClick={() => onAddToCart(producto)}>🛒 Añadir al Carrito</button>
    </div>
  );
}