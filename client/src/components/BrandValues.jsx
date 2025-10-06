import React from 'react';
import '../styles/Home.css';

const BrandValues = () => {
  return (
    <section className="valores-marca">
      <div className="placas-info">
        <div className="placa1">
          <div className="circle">🌱</div>
          <h1>Sustentabilidad</h1>
          <p>Madera ESC certificada de bosques responsables argentinos</p>
        </div>
        <div className="placa1">
          <div className="circle2">🏆</div>
          <h1>Programa Herencia Viva</h1>
          <p>Garantía extendida y servicio de restauración incluido</p>
        </div>
        <div className="placa1">
          <div className="circle3">🤝</div>
          <h1>Artesanía Local</h1>
          <p>Proveedores locales del Gran Buenos Aires únicamente</p>
        </div>
      </div>
    </section>
  );
};

export default BrandValues;
