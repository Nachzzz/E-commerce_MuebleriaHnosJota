export default function ProductDetail({ producto, onAddToCart, onVolver }) {
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <div className="product-detail">
      <button onClick={onVolver}>⬅ Volver al catálogo</button>
      <h2>{producto.nombre}</h2>
      <img src={producto.imagenUrl} alt={producto.nombre} />
      <p>{producto.descripcion}</p>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <button onClick={() => onAddToCart(producto)}>🛒 Añadir al carrito</button>
    </div>
  );
}

