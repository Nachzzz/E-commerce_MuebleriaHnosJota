import React from 'react';
import { Link } from 'react-router-dom'
import '../styles/Home.css';

const Footer = () => {
    return (
        <footer className='footer'>
            <div className="footer-content">
                <div className="logo">
                    <img src="/logo.svg" alt="Logo Mueblería Jota Hnos" />
                    <p>
                        Más de 30 años creando muebles <br /> de madera de autor. Tradición
                        artesanal con diseño contemporáneo
                    </p>
                </div>

                <div className="enlaces">
                    <h3>Enlaces Rápidos</h3>
                    <Link to = "/productos">
                        Nuestros Productos
                    </Link>
                    <br />
                    <Link to = "/nosotros">
                        Sobre Nosotros
                    </Link>
                </div>

                <div className="contacto">
                    <h3>Contacto</h3>
                    <p>
                        <img src="/Map pin.svg" alt="ubicación" className="icon-footer" />
                        Av. San Juan 2847 <br /> C1232AAB - Barrio de San Cristóbal <br /> Ciudad Autónoma de Buenos Aires <br /> Argentina
                    </p>
                    <p>
                        <img src="/phone.svg" alt="teléfono" className="icon-footer" />
                        +54 11 4567-8900
                    </p>
                    <p>
                        <img src="/Mail.svg" alt="mail" className="icon-footer" />
                        info@hermanosjota.com.ar <br /> ventas@hermanosjota.com.ar
                    </p>
                    <p>
                        <img src="/Instagram.svg" alt="instagram" className="icon-footer" />
                        @hermanosjota_ba
                    </p>
                </div>

                <div className="horarios">
                    <h3>Horarios</h3>
                    <p>
                        <img src="/Clock.svg" alt="clock" className="icon-footer" />
                        Lunes a Viernes: <br /> 10:00 - 19:00 <br /> <br /> Sábados: <br /> 10:00 - 14:00
                    </p>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 Mueblería Jota Hermanos. Todos los derechos reservados.</p>
                    <p>Creado con ❤ por Grupo 4</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
