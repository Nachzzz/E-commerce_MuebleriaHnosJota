import React, { useState } from 'react';
import '../styles/Contacto.css';

const Contacto = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contacto enviado:', form);
    setSubmitted(true);
    // opcional: limpiar formulario
    setForm({ name: '', email: '', message: '' });
    // ocultar mensaje después de unos segundos si se desea
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
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Tu nombre"
              value={form.name}
              onChange={handleChange}
            />
          </div>

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
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje:</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder="Escribe tu mensaje aquí"
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-enviar">Enviar</button>

          {submitted && <div className="success-message">Mensaje enviado correctamente. ¡Gracias!</div>}
        </form>
      </section>
    </main>
  );
};

export default Contacto;
