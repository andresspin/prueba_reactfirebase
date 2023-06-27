import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

const OrderDetails = ({ orderId }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Error al obtener el pedido:", error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: "Despachado" });
      fetchOrder();
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  return (
    <div>
      {order ? (
        <div>
          <h1>Detalles del Pedido #{order.order_number}</h1>
          <p>Total: ${order.total_price}</p>
          <p>Estado: {order.order_state}</p>
          {order.validations.negative && (
            <p className="validation-error">
              Se encontraron validaciones negativas
            </p>
          )}
          {order.sku_img_src && (
            <div>
              <h3>Imágenes de los SKU asociados:</h3>
              {order.sku_img_src.map((src, index) => (
                <img key={index} src={src} alt={`SKU ${index + 1}`} />
              ))}
            </div>
          )}
          {order.order_state !== "Despachado" && (
            <button onClick={handleStatusUpdate}>Despachar pedido</button>
          )}
        </div>
      ) : (
        <p>Cargando detalles del pedido...</p>
      )}
    </div>
  );
};

OrderDetails.propTypes = {
  orderId: PropTypes.string.isRequired,
};

export default OrderDetails;
