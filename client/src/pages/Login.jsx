import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';
import '../styles/Login.css';
import { ArrowLeft, LogIn, Eye, EyeOff } from 'lucide-react';


const logoHermanosjota = '/logo.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Login = ({ onPageChange }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(''); // Mensaje de éxito/error
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
    const [errors, setErrors] = useState({}); 
    const navigate = useNavigate()
    const { login } = useAuthContext();
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.email) tempErrors.email = 'El correo electrónico es requerido';
        // Validación simple para el email
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Correo electrónico inválido'; 

        if (!formData.password) tempErrors.password = 'La contraseña es requerida';
        else if (formData.password.length < 6) tempErrors.password = 'La contraseña debe tener al menos 6 caracteres';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return; // Detiene el envío si la validación falla
        }
        
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                let errorMessage = 'Error desconocido en el login.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || `Error del servidor (Estado: ${response.status})`;
                } catch (jsonError) {
                    const errorText = await response.text();
                    errorMessage = errorText ? `Error del servidor: ${errorText}` : `Error de conexión o servidor sin respuesta (Estado: ${response.status}).`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            if (data.token && data.user) {
                login(data.token, data.user);
                setMessage('✅ ¡Inicio de sesión exitoso! Redireccionando...');
                const redirectTo = location.state?.from || '/';
                setTimeout(() => {
                    navigate(redirectTo);
                    // window.location.href = '/'; 
                }, 1000);

            } else {
                throw new Error('Respuesta exitosa, pero no se recibió el token.');
            }

        } catch (error) {
            setMessage(''); // Limpiar mensaje de éxito
            alert(`Error en el login: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }
    
    // // Función de ejemplo para simular la navegación entre páginas
    // const handlePageChange = (page) => {
    //     console.log(`Navegando a: ${page}`);
    //     // Implementar lógica de navegación real (ej. router.push)
    //     if (onPageChange) onPageChange(page);
    // };

    return (
        <div className="login-container">
            <div className="login-grid-wrapper">

                <div className="brand-panel">
                    <div className="brand-panel-content">
                        <img
                            src="https://nachzzz.github.io/img_ecommerce/mesaDeNocheAconcagua.png"
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
                                Iniciar Sesión
                            </h2>
                            <p className="CardDescription">
                                Ingresa tus credenciales para acceder a tu cuenta
                            </p>
                        </div>
                        <div className="CardContent">
                            <form onSubmit={handleSubmit} className="login-form">

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

                                <div className="input-group">
                                    <label htmlFor="password" className="Label">Contraseña</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            placeholder="••••••••"
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

                                <div className="remember-forgot-group">
                                    <div className="remember-checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="remember-checkbox"
                                        />
                                        <label htmlFor="remember" className="text-sm cursor-pointer">
                                            Recordarme
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        className="forgot-password-btn"
                                        onClick={() => alert('Funcionalidad próximamente')}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="Button submit-button"
                                >
                                    {isLoading ? (
                                        'Iniciando sesión...'
                                    ) : (
                                        <>
                                            <LogIn className="icon-mr-2" />
                                            Iniciar Sesión
                                        </>
                                    )}
                                </button>
                                
                                {message && (
                                    <div style={{ padding: '0.5rem', textAlign: 'center', color: 'green', fontSize: '0.9rem' }}>
                                        {message}
                                    </div>
                                )}


                                <div className="divider-wrapper">
                                    <div className="divider-line" />
                                    <div className="divider-text-wrapper">
                                        <span className="divider-text">
                                            ¿No tienes cuenta?
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate('/registro')}
                                    className="Button register-button"
                                >
                                    Crear cuenta nueva
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="footer-info">
                        <p>
                            Al iniciar sesión, aceptas nuestros{' '}
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

export default Login;