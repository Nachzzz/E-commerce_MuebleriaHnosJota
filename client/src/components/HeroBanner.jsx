import React, { useEffect, useState } from "react";
import "../styles/HeroBanner.css";

const HeroBanner = () => {
  const [heroImg, setHeroImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchAsJson = async (url) => {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`API responded ${res.status}`);
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return await res.json();
      }
      // If it's not JSON, read text to provide a better error message
      const txt = await res.text();
      throw new Error(
        `Expected JSON but received ${contentType || "text/html"} - first chars: ${txt.slice(
          0,
          80
        )}`
      );
    };

    const fetchHero = async () => {
      try {
        let p;
        let data; // Declaramos data aquí
        // Try the relative path first (works if backend is proxied or served from same origin)
        try {
          // CORRECCIÓN 1: Pedimos TODOS los productos, no solo el ID "1"
          data = await fetchAsJson("/api/productos");
          p = data[0]; // Seleccionamos el primer producto de la lista
        } catch (err) {
          // If relative fails (for example Vite serving index.html returns HTML), fall back to explicit backend host
          try {
            // CORRECCIÓN 1 (Fallback): Pedimos TODOS los productos
            data = await fetchAsJson("http://localhost:4000/api/productos");
            p = data[0]; // Seleccionamos el primer producto
          } catch (err2) {
            // Prefer the original error if it looks like HTML was returned (Unexpected token '<')
            throw err2;
          }
        }

        // CORRECCIÓN 2: Usamos 'p.imagenUrl' (de MongoDB) en lugar de 'p.imagen'
        if (p && p.imagenUrl && mounted) {
          setHeroImg(p.imagenUrl);
        } else if (p && p.imagen && mounted) {
           // Fallback por si la URL de la imagen sigue estando en 'imagen'
          setHeroImg(p.imagen);
        }
        
      } catch (err) {
        if (mounted) setError(err.message || "Error fetching hero image");
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
            <div>Error cargando imagen: {error}</div>
          ) : heroImg ? (
            <img src={heroImg} alt="Muebles de Madera de Autor" />
          ) : (
            <div>Imagen no disponible</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default HeroBanner;