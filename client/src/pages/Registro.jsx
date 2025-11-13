import React, { useState } from 'react';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Registro = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/usuarios/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            // 1. Verificar si la respuesta fue exitosa (código 200-299)
            if (!response.ok) {
                // ** Manejo de Errores Mejorado **

                let errorMessage = 'Error desconocido en el registro.';

                // 2. Intentamos leer el cuerpo de la respuesta. 
                // Esto es crucial para manejar casos donde el cuerpo está vacío (JSON Invalido).
                try {
                    // Primero intentamos leer como JSON (si el servidor lo envió correctamente)
                    const errorData = await response.json();
                    errorMessage = errorData.message || `Error del servidor (Estado: ${response.status})`;

                } catch (jsonError) {
                    // Si falla la lectura de JSON (porque está vacío o mal formado)
                    // intentamos leer como texto para obtener cualquier mensaje de error simple.
                    const errorText = await response.text();

                    if (errorText) {
                        errorMessage = `Error del servidor: ${errorText}`;
                    } else {
                        // Caso del error original: cuerpo totalmente vacío (Unexpected end of JSON input)
                        errorMessage = `Error de conexión o servidor sin respuesta (Estado: ${response.status}).`;
                    }
                }

                throw new Error(errorMessage);
            }

            // 3. Si la respuesta fue OK, leemos el JSON de éxito
            const data = await response.json();
            alert(`¡Registro exitoso para ${data.username}!`);

        } catch (error) {
            alert(`Error en el registro: ${error.message}`);
        }
    }

    return (
        <div>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre de Usuario:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );


};

export default Registro;