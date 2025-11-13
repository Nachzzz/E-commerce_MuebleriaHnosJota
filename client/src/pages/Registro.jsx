// client/src/pages/Registro.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Reutilizamos el mismo CSS para mantener el estilo y la responsividad.
import '../styles/Login.css'; 

// En un entorno de desarrollo real, deberías importar SVGs o componentes de iconos (ej. lucide-react)
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const UserPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLineLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 13v9"/><path d="M18 19h8"/></svg>;
const Eye = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.51 10.51 2 12s3 7 10 7 10-7 10-7"/><path d="M12 5c2 0 4 1.33 5.5 3.5"/><path d="m2 2 20 20"/></svg>;
const logoHermanosjota = '/logo.svg';
// *****************************************************************

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Registro = () => {
    const [formData, setFormData] = useState({
        username: '', // Nuevo campo
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({}); 
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        let tempErrors = {};
        
        if (!formData.username) tempErrors.username = 'El nombre de usuario es requerido';
        else if (formData.username.length < 3) tempErrors.username = 'El usuario debe tener al menos 3 caracteres';

        if (!formData.email) tempErrors.email = 'El correo electrónico es requerido';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Correo electrónico inválido'; 

        if (!formData.password) tempErrors.password = 'La contraseña es requerida';
        else if (formData.password.length < 6) tempErrors.password = 'La contraseña debe tener al menos 6 caracteres';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }
        
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/usuarios/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                let errorMessage = 'Error desconocido en el registro.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || `Error del servidor (Estado: ${response.status})`;
                } catch (jsonError) {
                    const errorText = await response.text();
                    errorMessage = errorText ? `Error del servidor: ${errorText}` : `Error de conexión o servidor sin respuesta (Estado: ${response.status}).`;
                }
                throw new Error(errorMessage);
            }

            // Registro exitoso
            const data = await response.json();
            
            setMessage(`✅ ¡Registro exitoso para ${data.username}! Redireccionando al Login...`);
                
            setTimeout(() => {
                navigate('/login'); 
            }, 1500);

        } catch (error) {
            setMessage(''); 
            alert(`Error en el registro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }
    

    return (
        <div className="login-container">
            <div className="login-grid-wrapper">

                {/* Panel Izquierdo de Marca (Reutilizado) */}
                <div className="brand-panel">
                    <div className="brand-panel-content">
                        <img
                            src="https://images.unsplash.com/photo-1633419946251-6d8b5dd33170?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdHNtYW4lMjB3b29kJTIwd29ya3Nob3B8ZW58MXx8fHwxNzYyMjA2NTc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Taller Hermanos Jota"
                            className="brand-image"
                        />
                        <div className="image-overlay" />
                        <div className="brand-info">
                            <div className="brand-logo-group">
                                <img
                                    src={logoHermanosjota}
                                    alt="Hermanos Jota"
                                    className="brand-logo-img"
                                />
                                <div>
                                    <h2 className="brand-title">Hermanos Jota</h2>
                                    <p className="brand-subtitle">Muebles que alimentan el alma</p>
                                </div>
                            </div>
                            <p className="brand-description">
                                Más de 30 años creando piezas únicas de madera de autor. 
                                Tradición, calidad y diseño en cada detalle.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Panel Derecho - Formulario de Registro */}
                <div className="login-form-panel">
                    <div className="back-to-home-link">
                        <button
                            type="button"
                            onClick={() => navigate('/inicio')}
                            className="Button ghost-button"
                        >
                            <ArrowLeft className="icon-mr-2" />
                            Volver al inicio
                        </button>
                    </div>

                    <div className="Card">
                        <div className="CardHeader">
                            <div className="logo-mobile-wrapper">
                                <img
                                    src={logoHermanosjota}
                                    alt="Hermanos Jota"
                                    className="h-12 w-auto"
                                />
                            </div>
                            <h2 className="CardTitle">
                                Crear Cuenta
                            </h2>
                            <p className="CardDescription">
                                Regístrate para comenzar a comprar
                            </p>
                        </div>
                        <div className="CardContent">
                            <form onSubmit={handleSubmit} className="login-form">

                                {/* Campo Nombre de Usuario */}
                                <div className="input-group">
                                    <label htmlFor="username" className="Label">Nombre de Usuario</label>
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Tu nombre de usuario"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className={`Input brand-input ${errors.username ? 'border-destructive' : ''}`}
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-destructive">{errors.username}</p>
                                    )}
                                </div>
                                
                                {/* Campo Email */}
                                <div className="input-group">
                                    <label htmlFor="email" className="Label">Correo electrónico</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="tu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={`Input brand-input ${errors.email ? 'border-destructive' : ''}`}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                {/* Campo Contraseña */}
                                <div className="input-group">
                                    <label htmlFor="password" className="Label">Contraseña</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            placeholder="Mínimo 6 caracteres"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className={`Input brand-input ${errors.password ? 'border-destructive' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="toggle-password-btn"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                {/* El grupo de 'Recordarme' y 'Olvidé contraseña' se omite en el registro, manteniendo el espaciado si se desea.
                                    Para un formulario de registro simple, podemos quitar este div: */}
                                {/* <div className="remember-forgot-group">...</div> */}
                                
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="Button submit-button"
                                >
                                    {isLoading ? (
                                        'Registrando...'
                                    ) : (
                                        <>
                                            <UserPlus className="icon-mr-2" />
                                            Crear Cuenta
                                        </>
                                    )}
                                </button>
                                
                                {message && (
                                    <div style={{ padding: '0.5rem', textAlign: 'center', color: message.startsWith('✅') ? 'green' : 'red', fontSize: '0.9rem' }}>
                                        {message}
                                    </div>
                                )}


                                <div className="divider-wrapper">
                                    <div className="divider-line" />
                                    <div className="divider-text-wrapper">
                                        <span className="divider-text">
                                            ¿Ya tienes una cuenta?
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="Button register-button"
                                >
                                    Ir a Iniciar Sesión
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="footer-info">
                        <p>
                            Al registrarte, aceptas nuestros{' '}
                            <button className="footer-link">
                                Términos y Condiciones
                            </button>{' '}
                            y{' '}
                            <button className="footer-link">
                                Política de Privacidad
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;