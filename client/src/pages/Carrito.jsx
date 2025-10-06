import React, { useContext } from 'react';
import CartContext from '../context/CartContext';
import '../styles/Carrito.css';
import { useNavigate } from 'react-router-dom';

export default function Carrito() {
  const { cartItems, removeFromCart, setQuantity, totalCount, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="carrito-empty">
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/productos')} className="btn-primary">Ver productos</button>
      </main>
    );
  }

  return (
    <main className="carrito">
      <h1>Tu carrito</h1>
      <div className="carrito-list">
        {cartItems.map(item => (
          <div className="carrito-item" key={item.id}>
            <img src={item.imagen} alt={item.nombre} />
            <div className="detalle">
              <h3>{item.nombre}</h3>
              <p>${item.precio}</p>
              <div className="qty">
                <button onClick={() => setQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
            <div className="acciones-item">
              <button className="btn-secondary" onClick={() => removeFromCart(item.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <aside className="resumen">
        <p>Items: {totalCount}</p>
        <p>Total: ${totalPrice.toLocaleString()}</p>
        <button className="btn-primary" onClick={() => navigate('/checkout')}>Ir a pagar</button>
        <button className="btn-secondary" onClick={() => clearCart()}>Vaciar carrito</button>
      </aside>
    </main>
  );
}
