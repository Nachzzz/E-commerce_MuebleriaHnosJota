import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import NotificationContext from '../context/NotificationContext';
import { useAuthContext } from '../context/AuthContext';
import '../styles/Checkout.css';
import { ShieldCheck, CreditCard } from 'lucide-react';

// Variable de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useAuthContext();
  const { show } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: user?.username || '',
    email: user?.email || '',
    direccion: '',
    ciudad: '',
    codPostal: '',
    tarjeta: '',
    vencimiento: '',
    cvv: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      show('Tu carrito está vacío. Agrega productos primero.');
      navigate('/productos');
    }
  }, [cartItems, navigate, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
        // 1. Obtener token seguro
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error("Debes iniciar sesión para comprar.");
        }

        // 2. Formatear los ítems como los espera el Backend (Order Model)
        const orderItems = cartItems.map(item => ({
            producto: item.id, // El backend espera 'producto' como ID
            nombre: item.nombre,
            cantidad: item.quantity,
            precio: item.precio,
            imagen: item.imagen
        }));

        // 3. Construir el payload
        const orderData = {
            items: orderItems,
            shippingDetails: {
                nombre: formData.nombre,
                email: formData.email,
                direccion: formData.direccion,
                ciudad: formData.ciudad,
                codPostal: formData.codPostal
            },
            totalAmount: totalPrice
        };

        // 4. Enviar al Backend
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al procesar la orden');
        }

        // 5. Éxito
        clearCart();
        show(`¡Compra exitosa! Orden #${data._id.slice(-6)} registrada.`);
        // Redirigimos al perfil para que vea su nuevo pedido
        navigate('/perfil');

    } catch (error) {
        console.error("Error Checkout:", error);
        show(`Error: ${error.message}`);
    } finally {
        setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <main className="checkout-page">
      <h1 className="checkout-title">Finalizar Compra</h1>

      <div className="checkout-grid">
        {/* IZQUIERDA: FORMULARIO */}
        <section className="checkout-form-section">
          <form onSubmit={handleSubmit}>
            <h2>Datos de Envío</h2>
            
            <div className="form-group">
              <label>Nombre Completo</label>
              <input 
                type="text" name="nombre" value={formData.nombre} onChange={handleChange} required 
                placeholder="Juan Pérez"
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} required 
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input 
                type="text" name="direccion" value={formData.direccion} onChange={handleChange} required 
                placeholder="Calle Falsa 123"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ciudad</label>
                <input 
                  type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required 
                />
              </div>
              <div className="form-group">
                <label>Código Postal</label>
                <input 
                  type="text" name="codPostal" value={formData.codPostal} onChange={handleChange} required 
                />
              </div>
            </div>

            <h2 style={{marginTop: '30px'}}>Datos de Pago</h2>
            <div className="form-group">
              <label>Número de Tarjeta</label>
              <div style={{position: 'relative'}}>
                <input 
                  type="text" name="tarjeta" value={formData.tarjeta} onChange={handleChange} required 
                  placeholder="0000 0000 0000 0000" maxLength="19"
                />
                <CreditCard size={20} style={{position: 'absolute', right: '10px', top: '12px', color: '#999'}}/>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vencimiento</label>
                <input 
                  type="text" name="vencimiento" placeholder="MM/AA" value={formData.vencimiento} onChange={handleChange} required maxLength="5"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input 
                  type="password" name="cvv" placeholder="123" value={formData.cvv} onChange={handleChange} required maxLength="4"
                />
              </div>
            </div>
          </form>
        </section>

        {/* DERECHA: RESUMEN */}
        <aside className="checkout-summary">
          <h2>Resumen del Pedido</h2>
          
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.quantity} x {item.nombre}</span>
                <span>${(item.precio * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="summary-item">
            <span>Envío</span>
            <span style={{color: 'green'}}>Gratis</span>
          </div>

          <div className="summary-total">
            <span>Total a Pagar</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>

          <button 
            className="btn-checkout" 
            onClick={handleSubmit} 
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : (
                <>
                    <ShieldCheck size={20} /> Confirmar Compra
                </>
            )}
          </button>
          
          <p style={{fontSize: '0.8rem', color: '#777', marginTop: '15px', textAlign: 'center'}}>
            <ShieldCheck size={14} style={{verticalAlign: 'middle', marginRight:'4px'}}/>
            Pagos procesados de forma segura.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;