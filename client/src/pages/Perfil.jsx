import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import '../styles/Perfil.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Perfil = () => {
    const { user, logout, isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    
    // Estados para el historial
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Redirigir si no hay sesión
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    // FETCH de Pedidos
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) return;

                const res = await fetch(`${API_URL}/api/orders/mis-pedidos`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error cargando pedidos:", error);
            } finally {
                setLoadingOrders(false);
            }
        };

        if (isLoggedIn) {
            fetchOrders();
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!user) return null;

    const initial = user.username ? user.username.charAt(0).toUpperCase() : "U";

    return (
        <main className="perfil-container">
            <div className="perfil-header">
                <h1 className="perfil-title">Mi Perfil</h1>
                <p className="perfil-subtitle">Administra tu información personal y pedidos</p>
            </div>

            <div className="perfil-grid">
                {/* Sidebar Izquierda */}
                <aside className="perfil-sidebar">
                    <div className="avatar-placeholder">
                        {initial}
                    </div>
                    <h2>{user.username}</h2>
                    <span className="user-role-badge">
                        {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                </aside>

                {/* Contenido Derecha */}
                <section className="perfil-content">
                    <div className="info-group">
                        <label>Nombre de Usuario</label>
                        <div className="info-value">{user.username}</div>
                    </div>

                    <div className="info-group">
                        <label>Correo Electrónico</label>
                        <div className="info-value">{user.email}</div>
                    </div>

                    <div className="orders-section">
                        <h3>Historial de Pedidos</h3>
                        
                        {loadingOrders ? (
                            <p>Cargando historial...</p>
                        ) : orders.length === 0 ? (
                            <div className="empty-orders">
                                <p>No tienes pedidos recientes.</p>
                                <button 
                                    style={{marginTop: '10px', fontSize: '0.9rem'}} 
                                    onClick={() => navigate('/productos')}
                                >
                                    Ir al catálogo
                                </button>
                            </div>
                        ) : (
                            /* LISTA DE PEDIDOS */
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order._id} style={{
                                        border: '1px solid #eee', 
                                        borderRadius: '8px', 
                                        padding: '15px', 
                                        marginBottom: '15px',
                                        background: '#fafafa'
                                    }}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                            <span style={{fontWeight: 'bold', color: '#A0522D'}}>Orden #{order._id.slice(-6)}</span>
                                            <span style={{color: '#666', fontSize: '0.9rem'}}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{fontSize: '0.95rem', color: '#444'}}>
                                            <p><strong>Total:</strong> ${order.totalAmount.toLocaleString()}</p>
                                            <p><strong>Estado:</strong> {order.status === 'paid' ? 'Pagado' : order.status}</p>
                                            <p><strong>Ítems:</strong> {order.items.length}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </section>
            </div>
        </main>
    );
};

export default Perfil;