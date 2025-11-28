import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importamos useParams
import { useAuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Estilos (se mantienen igual)
const styles = {
  main: { padding: '2rem', maxWidth: '800px', margin: '2rem auto', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '0.5rem', fontWeight: '600' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' },
  button: { padding: '12px 20px', background: '#A0522D', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }
};

const CrearProducto = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtenemos el ID de la URL (si existe)
  const { token } = useAuthContext();
  const isEditing = !!id; // Bandera para saber si estamos editando

  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', descripcion1: '', precio: 0, stock: 0, 
    imagenUrl: '', tipo: '', material: '', medidas: '', acabado: '' 
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Efecto para cargar datos si estamos editando
  useEffect(() => {
    if (isEditing) {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/productos/${id}`);
                if (!res.ok) throw new Error('No se pudo cargar el producto');
                const data = await res.json();
                
                // Rellenar formulario con datos existentes
                setFormData({
                    nombre: data.nombre || '',
                    descripcion: data.descripcion || '',
                    descripcion1: data.descripcion1 || '',
                    precio: data.precio || 0,
                    stock: data.stock || 0,
                    imagenUrl: data.imagenUrl || data.imagen || '',
                    tipo: data.tipo || '',
                    material: data.material || '',
                    medidas: data.medidas || '',
                    acabado: data.acabado || ''
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }
  }, [id, isEditing]);

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

    // Validaciones básicas
    if (formData.nombre.trim().length < 2) {
        setError('El nombre debe tener al menos 2 caracteres.');
        return;
    }

    try {
      // 2. Determinar URL y Método según el modo
      const url = isEditing ? `${API_URL}/api/productos/${id}` : `${API_URL}/api/productos`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.errors ? data.errors[0].msg : (data.msg || data.message || 'Error al guardar.');
        throw new Error(errorMsg);
      }

      setSuccess(`¡Producto "${data.nombre}" ${isEditing ? 'actualizado' : 'creado'} con éxito!`);
      
      // Si creamos, limpiamos. Si editamos, redirigimos.
      if (!isEditing) {
          setFormData({ 
            nombre: '', descripcion: '', descripcion1: '', precio: 0, stock: 0, 
            imagenUrl: '', tipo: '', material: '', medidas: '', acabado: '' 
          });
      } else {
          setTimeout(() => navigate(`/productos/${id}`), 1500);
      }

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Cargando datos del producto...</div>;

  return (
    <main style={styles.main}>
      <h2>Panel de Administración</h2>
      <h1>{isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}</h1>
      <p>{isEditing ? 'Modifica los campos necesarios y guarda los cambios.' : 'Completa el formulario para añadir un nuevo ítem.'}</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        
        <div style={styles.formGroup}>
          <label htmlFor="nombre" style={styles.label}>Nombre del Producto *</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={{display:'flex', gap:'20px'}}>
            <div style={{...styles.formGroup, flex:1}}>
                <label htmlFor="precio" style={styles.label}>Precio *</label>
                <input type="number" id="precio" name="precio" value={formData.precio} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={{...styles.formGroup, flex:1}}>
                <label htmlFor="stock" style={styles.label}>Stock</label>
                <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} style={styles.input} />
            </div>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="descripcion" style={styles.label}>Descripción Corta</label>
          <input type="text" id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="descripcion1" style={styles.label}>Descripción Larga</label>
          <textarea id="descripcion1" name="descripcion1" value={formData.descripcion1} onChange={handleChange} style={{...styles.input, minHeight:'100px'}} />
        </div>

        <div style={{display:'flex', gap:'20px', flexWrap:'wrap'}}>
            <div style={{...styles.formGroup, flex:1, minWidth:'200px'}}>
                <label htmlFor="material" style={styles.label}>Material</label>
                <input type="text" id="material" name="material" value={formData.material} onChange={handleChange} style={styles.input} />
            </div>
            <div style={{...styles.formGroup, flex:1, minWidth:'200px'}}>
                <label htmlFor="medidas" style={styles.label}>Medidas</label>
                <input type="text" id="medidas" name="medidas" value={formData.medidas} onChange={handleChange} style={styles.input} />
            </div>
            <div style={{...styles.formGroup, flex:1, minWidth:'200px'}}>
                <label htmlFor="acabado" style={styles.label}>Acabado</label>
                <input type="text" id="acabado" name="acabado" value={formData.acabado} onChange={handleChange} style={styles.input} />
            </div>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="imagenUrl" style={styles.label}>URL de la Imagen</label>
          <input type="text" id="imagenUrl" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} style={styles.input} placeholder="https://..." />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="tipo" style={styles.label}>Categoría (Tipo)</label>
          <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} style={styles.input}>
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

        <button type="submit" style={styles.button}>
            {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
        </button>

        {success && <p style={{ color: 'green', fontWeight:'bold' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </main>
  );
};

export default CrearProducto;