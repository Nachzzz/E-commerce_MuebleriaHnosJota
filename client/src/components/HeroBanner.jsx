import React, { useEffect, useState } from "react";
import "../styles/HeroBanner.css";

const HeroBanner = () => {
  const [heroImg, setHeroImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchHero = async () => {
      try {
        const res = await fetch('/api/productos');
        if (!res.ok) throw new Error('API not available');
        const products = await res.json();
        const p = products.find((x) => Number(x.id) === 1);
        if (p && p.imagen && mounted) setHeroImg(p.imagen);
      } catch (err) {
        try {
          const res2 = await fetch('/data/productos.json');
          const products2 = await res2.json();
          const p2 = products2.find((x) => Number(x.id) === 1);
          if (p2 && p2.imagen && mounted) setHeroImg(p2.imagen);
        } catch (err2) {
          if (mounted) {
            console.error(err2);
            setError(err2.message || 'Error cargando productos');
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHero();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main>
      <section className="hero-banner">
        <div className="info_hero">
          <h2>EL REDESCUBRIMIENTO DE UN ARTE OLVIDADO</h2>
          <h1>
            Muebles que <br />
            <span style={{ color: "#A0522D" }}>Alimentan el alma</span>
          </h1>
          <p>
            Existimos en la intersección entre herencia e innovación,
            <br /> donde la calidez del optimismo de los años 60 se encuentra
            <br /> con la conciencia de la sustentabilidad del 2025.
          </p>

          <div className="div-btn">
            <a className="btn-hero links" href="/contacto">
              Contactanos
            </a>
            <a className="btn-hero1 links" href="/nosotros">
              Nuestra Historia
            </a>
          </div>

          <div className="info_hero2">
            <div className="info_hero2-item fsc">
              <h2>FSC</h2>
              <p>Certificado</p>
            </div>
            <div className="info_hero2-item reciclado">
              <h2>30%</h2>
              <p>Materiales Reciclados</p>
            </div>
            <div className="info_hero2-item garantia">
              <h2>10</h2>
              <p>Garantía</p>
            </div>
          </div>
        </div>

        <div className="img_hero">
          {loading ? (
            <div>Loading image...</div>
          ) : error ? (
            <div>Error cargando imagen</div>
          ) : (
            <img src={heroImg} alt="Muebles de Madera de Autor" />
          )}
        </div>
      </section>
    </main>
  );
};

export default HeroBanner;