import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams(); // obtiene el id de la URL

  return (
    <main className="detalle-producto">
      <h1>Detalle del producto</h1>
      <p>Mostrando información del producto con id: {id}</p>
    </main>
  );
};

export default ProductDetail;