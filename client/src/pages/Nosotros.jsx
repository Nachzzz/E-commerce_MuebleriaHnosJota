import React, { useEffect, useState } from "react";
import '../styles/Nosotros.css';

export default function Nosotros() {

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
            let data;
            try {
              data = await fetchAsJson("/api/productos");
              p = data[4];
            } catch (err) {
              try {
                data = await fetchAsJson("http://localhost:4000/api/productos");
                p = data[4];
              } catch (err2) {
                throw err2;
              }
            }
    
            if (p && p.imagenUrl && mounted) setHeroImg(p.imagenUrl);
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
          <h2></h2>
          <h1>El Redescubrimiento <br />
            <span style={{ color: 'var(--brand-siena-tostado)' }}>de un arte olvidado</span>
          </h1>
          <p>Existimos en la intersección entre herencia e innovación,<br />
            donde la calidez del optimismo de los años 60 se encuentra<br />
            con la conciencia de la sustentabilidad del 2025.</p>

          <div className="info_hero2">
            <div className="info_hero2-item fsc">
              <h2>30+</h2>
              <p>Años de tradición</p>
            </div>
            <div className="info_hero2-item reciclado">
              <h2>2500+</h2>
              <p>Piezas creadas</p>
            </div>
            <div className="info_hero2-item garantia">
              <h2>FSC</h2>
              <p>Certificado</p>
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

      <section className="timeline-section">
        <div className="timeline-header">
          <span className="timeline-subtitle">33 AÑOS DE EVOLUCIÓN CONSTANTE</span>
          <h2 className="timeline-title">Nuestra Historia</h2>
          <p className="timeline-description">
            Cada década ha marcado un hito en nuestro camino hacia la excelencia artesanal y la sustentabilidad.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline-line" />

          <div className="timeline-item left">
            <div className="timeline-content">
              <span className="timeline-year">1992</span>
              <span className="timeline-tag">Fundación del taller familiar</span>
              <h3>Los Primeros Pasos</h3>
              <p>Los hermanos Jota fundan su primer taller en San Cristóbal con la visión de rescatar técnicas
                artesanales tradicionales.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content">
              <span className="timeline-year">1998</span>
              <span className="timeline-tag">Primer showroom oficial</span>
              <h3>Expansión del Showroom</h3>
              <p>Apertura del primer showroom en Av. San Juan, estableciendo las bases de lo que sería una
                tradición de 30+ años.</p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-content">
              <span className="timeline-year">2005</span>
              <span className="timeline-tag">Pioneros en sustentabilidad</span>
              <h3>Certificación FSC</h3>
              <p>Hermanos Jota se convierte en uno de los primeros talleres argentinos en obtener
                certificación FSC para madera sustentable.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content">
              <span className="timeline-year">2015</span>
              <span className="timeline-tag">Compromiso con la durabilidad</span>
              <h3>Programa Herencia Viva</h3>
              <p>Lanzamiento del programa que garantiza
                la restauración y mantenimiento de cada pieza durante 10 años.</p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-content">
              <span className="timeline-year">2020</span>
              <span className="timeline-tag">Innovación sustentable</span>
              <h3>Materiales Reciclados</h3>
              <p>Incorporación del 30% de materiales reciclados en
                todas las nuevas creaciones, manteniendo la calidad premium.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content">
              <span className="timeline-year">2025</span>
              <span className="timeline-tag">Tradición y tecnología</span>
              <h3>Transformación Digital</h3>
              <p>Lanzamiento de la plataforma digital para
                compartir nuestra pasión por los muebles que alimentan el alma.</p>
            </div>
          </div>
        </div>

        <div className="valores-header">
          <span className="timeline-subtitle">LOS PILARES DE NUESTROS VALORES</span>
          <h2 className="timeline-title">Nuestros Valores</h2>
          <p className="timeline-description">
            Cada pieza que creamos refleja estos valores fundamentales que guían nuestro trabajo diario.
          </p>
        </div>
      </section>

      <section className="valores-marca">
        <div className="placas-info">
          <div className="placa1">
            <div className="circle">🌱</div>
            <h1>Sustentabilidad</h1>
            <p>Madera ESC certificada de bosques responsables argentinos</p>
          </div>
          <div className="placa1">
            <div className="circle2">💚</div>
            <h1>Artesanía</h1>
            <p>Más de 30 años perfeccionando técnicas tradicionales</p>
          </div>
          <div className="placa1">
            <div className="circle3">✨</div>
            <h1>Calidad Premium</h1>
            <p>Cada pieza pasa por 15 <br />controles de calidad</p>
          </div>
          <div className="placa1">
            <div className="circle4">🌲</div>
            <h1>Origen Local</h1>
            <p>Proveedores exclusivos del <br /> Gran Buenos Aires</p>
          </div>
        </div>
      </section>

      <section className="herencia-viva">
        <div className="info_herencia">
          <h2>COMPROMISO PARA TODA LA VIDA</h2>
          <h1>Programa <br />
            <span style={{ color: 'var(--brand-siena-tostado)' }}>Herencia viva</span>
          </h1>
          <p>Cada mueble que creamos viene acompañado de nuestro<br />
            programa Herencia Viva: 10 años de garantía extendida y<br />
            servicio de restauración incluido.</p>

          <ul className="lista-servicios">
            <li>
              <strong>Garantía extendida 10 años</strong><br />
              Cubrimos cualquier defecto de fabricación o desgaste prematuro
            </li>
            <li>
              <strong>Servicio de restauración</strong><br />
              Mantenimiento y restauración profesional sin costo adicional
            </li>
            <li>
              <strong>Taller de cuidados</strong><br />
              Talleres gratuitos para el cuidado adecuado de tu mueble
            </li>
          </ul>

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
}
