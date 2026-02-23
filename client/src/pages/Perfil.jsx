import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import '../styles/Perfil.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Perfil = () => {
    const { user, token, login, logout, isLoggedIn } = useAuthContext();
    const navigate = useNavigate();

    // Estados para el historial
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    // --- ESTADOS PARA LA FOTO DE PERFIL ---
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null); // Referencia para simular el clic en el input de archivo

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

    // --- FUNCIÓN PARA SUBIR EL AVATAR ---
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingAvatar(true);

        // FormData permite enviar archivos e información en la misma petición
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${API_URL}/api/usuarios/avatar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}` // Usamos el token del contexto
                    // IMPORTANTE: Al usar FormData, NO se debe setear el 'Content-Type'. 
                    // El navegador lo hace automáticamente incluyendo el "boundary" necesario.
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();

                // data.user trae el usuario con la nueva URL de Cloudinary
                // Reutilizamos la función login() para actualizar el localStorage y el Contexto
                login(token, data.user);
                alert("¡Foto de perfil actualizada exitosamente!");
            } else {
                const errorData = await res.json();
                alert(`Error al actualizar la foto: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error subiendo avatar:", error);
            alert("Ocurrió un error inesperado al subir la imagen.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <main className="perfil-container">
            <div className="perfil-header">
                <h1 className="perfil-title">Mi Perfil</h1>
                <p className="perfil-subtitle">Administra tu información personal y pedidos</p>
            </div>

            <div className="perfil-grid">
                {/* Sidebar Izquierda */}
                <aside className="perfil-sidebar">
                    {/* Contenedor del Avatar */}
                    <div
                        className="avatar-placeholder"
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none',
                        }}
                        title="Cambiar foto de perfil"
                    >
                        {/* Si no hay foto, mostramos la inicial */}
                        {!user?.avatar && !uploadingAvatar && (
                            <span className="avatar-initial">{initial}</span>
                        )}

                        {/* Capa de Hover (Overlay) con Blur y Lápiz */}
                        <div className="avatar-overlay">
                            {/* Ícono de lápiz SVG puro */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                        </div>

                        {/* Indicador de carga visual */}
                        {uploadingAvatar && (
                            <div className="avatar-loading">
                                <span className="loader-text">Subiendo...</span>
                            </div>
                        )}
                    </div>

                    {/* Input de tipo file oculto */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        style={{ display: 'none' }}
                    />

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

                    {/* --- SECCIÓN EXCLUSIVA PARA ADMINISTRADORES --- */}
                    {user?.role === 'admin' && (
                        <div className="admin-actions-panel" style={{
                            margin: '20px 0',
                            padding: '20px',
                            backgroundColor: '#fdfbf9',
                            border: '1px solid #e0e0e0',
                            borderRadius: '12px'
                        }}>
                            <h3 style={{ color: '#333', marginBottom: '10px' }}>📊 Gestión del Negocio</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                                Accede al panel de estadísticas para supervisar ventas e ingresos.
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="Button"
                                    style={{
                                        backgroundColor: '#A0522D',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Ir al Dashboard
                                </button>
                                <button
                                    onClick={() => navigate('/admin/crear-producto')}
                                    className="Button"
                                    style={{
                                        backgroundColor: '#555',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Gestionar Productos
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="orders-section">
                        <h3>Historial de Pedidos</h3>

                        {loadingOrders ? (
                            <p>Cargando historial...</p>
                        ) : orders.length === 0 ? (
                            <div className="empty-orders">
                                <p>No tienes pedidos recientes.</p>
                                <button
                                    style={{ marginTop: '10px', fontSize: '0.9rem' }}
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#A0522D' }}>Orden #{order._id.slice(-6)}</span>
                                            <span style={{ color: '#666', fontSize: '0.9rem' }}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.95rem', color: '#444' }}>
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