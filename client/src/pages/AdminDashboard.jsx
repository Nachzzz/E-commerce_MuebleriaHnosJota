import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const AdminDashboard = () => {
    const { token } = useAuthContext();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await fetch(`${API_URL}/api/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        };
        fetchStats();
    }, [token]);

    if (!stats) return <p>Cargando estadísticas...</p>;

    return (
        <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Dashboard de Administración</h1>
            
            {/* Tarjetas de resumen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="Card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>Ingresos Totales</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#A0522D' }}>${stats.revenue.toLocaleString()}</p>
                </div>
                <div className="Card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>Órdenes Pagadas</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.ordersCount}</p>
                </div>
                <div className="Card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>Productos Activos</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.productsCount}</p>
                </div>
            </div>

            {/* Gráfico de Ventas */}
            <div className="Card" style={{ padding: '20px', height: '400px' }}>
                <h3>Ventas Mensuales (Ingresos)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.salesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" tickFormatter={(val) => `Mes ${val}`} />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Bar dataKey="monto" fill="#A0522D" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <button onClick={() => window.history.back()} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#A0522D', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>Regresar</button>
        </main>
    );
};

export default AdminDashboard;