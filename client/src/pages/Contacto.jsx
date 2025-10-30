import React, { useState } from 'react';
import '../styles/Contacto.css';

const Contacto = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({}); // 1. Nuevo estado para manejar errores
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Limpiamos el error del campo actual al escribir
    setErrors((prev) => ({ ...prev, [name]: '' })); 
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  // 2. Función de validación del formulario
  const validateForm = () => {
    const newErrors = {};
    const { name, message } = form;

    // Validación estricta para 'name': Mínimo 2 caracteres (no solo 1)
    if (name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    }

    // Validación estricta para 'message': Mínimo 5 caracteres
    if (message.trim().length < 5) {
      newErrors.message = 'El mensaje debe tener al menos 5 caracteres.';
    }
    
    // Aquí podrías añadir una validación más robusta para el email si fuera necesario
    // if (!/\S+@\S+\.\S+/.test(form.email)) {
    //   newErrors.email = 'El correo electrónico no es válido.';
    // }

    setErrors(newErrors);
    
    // Retorna true si el objeto de errores está vacío
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(false); // Reiniciamos el estado de enviado

    // 3. Llamar a la validación antes de continuar
    if (!validateForm()) {
      console.log('El formulario contiene errores y no se enviará.');
      return; // Detiene el envío si hay errores
    }

    // Si la validación es exitosa:
    // **AQUÍ IRÍA TU LLAMADA A LA API (Express) USANDO fetch o axios**
    // Ejemplo: axios.post('/api/contacto', form).then(res => {...});

    console.log('✅ Contacto enviado:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <main className="contacto-page">
      <section className="contacto-section">
        <h1>Contacto</h1>
        <p className="contacto-desc">
          Estamos aquí para ayudarte.
          <br />Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.
        </p>

        <form id="contacto" className="contacto-form" onSubmit={handleSubmit} autoComplete="off">
          
          {/* Campo Nombre */}
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Tu nombre (mín. 2 caracteres)"
              value={form.name}
              onChange={handleChange}
            />
            {/* Mostrar error de 'name' si existe */}
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          {/* Campo Correo Electrónico */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="ejemplo@correo.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          {/* Campo Mensaje */}
          <div className="form-group">
            <label htmlFor="message">Mensaje:</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder="Escribe tu mensaje aquí (mín. 5 caracteres)"
              value={form.message}
              onChange={handleChange}
            />
            {/* Mostrar error de 'message' si existe */}
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>

          <button type="submit" className="btn-enviar">Enviar</button>

          {submitted && <div className="success-message">Mensaje enviado correctamente. ¡Gracias!</div>}
        </form>
      </section>
    </main>
  );
};

export default Contacto;