import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Estilos provisorioss para el formulario xd
const styles = {
  main: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '2rem auto',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  button: {
    padding: '12px 20px',
    background: '#A0522D',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  }
};

const CrearProducto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    tipo: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación simple de frontend
    if (formData.nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    if (formData.precio <= 0) {
      setError('El precio debe ser mayor a 0.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si el backend envía errores de validación, los mostramos
        const errorMsg = data.errors ? data.errors[0].msg : (data.msg || 'Error al crear el producto.');
        throw new Error(errorMsg);
      }

      setSuccess(`¡Producto "${data.nombre}" creado con éxito! Redirigiendo...`);
      setFormData({ nombre: '', descripcion: '', precio: 0, stock: 0, imagenUrl: '', tipo: '' });

      // Redirigir al catálogo después de 2 segundos
      setTimeout(() => {
        navigate('/productos');
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main style={styles.main}>
      <h2>Panel de Administración</h2>
      <h1>Crear Nuevo Producto</h1>
      <p>
        Este formulario enviará los datos para crear un nuevo ítem en el catálogo.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.formGroup}>
          <label htmlFor="nombre" style={styles.label}>Nombre del Producto *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="precio" style={styles.label}>Precio *</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="stock" style={styles.label}>Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="descripcion" style={styles.label}>Descripción Corta</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="descripcion1" style={styles.label}>Descripción Larga</label>
          <input
            type="text"
            id="descripcion1"
            name="descripcion1"
            value={formData.descripcion1}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="imagenUrl" style={styles.label}>URL de la Imagen</label>
          <input
            type="text"
            id="imagenUrl"
            name="imagenUrl"
            value={formData.imagenUrl}
            onChange={handleChange}
            style={styles.input}
            placeholder="https://ejemplo.com/imagen.png"
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="tipo" style={styles.label}>Categoría (Tipo)</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="" disabled>Selecciona una categoría</option>
            <option value="Silla">Silla</option>
            <option value="Mesa">Mesa</option>
            <option value="Sofá">Sofá</option>
            <option value="Cama">Cama</option>
            <option value="Aparador">Aparador</option>
            <option value="Escritorio">Escritorio</option>
            <option value="Butaca">Butaca</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Guardar Producto</button>

        {/* Mensajes de estado */}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </main>
  );
};

export default CrearProducto;