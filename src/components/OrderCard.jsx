
import PropTypes from "prop-types";

const OrderCard = ({ order }) => {
  const { order_number, order_items, total_price, validations } = order;

  return (
    <div
      className={`order-card ${
        validations.negative ? "negative-validation" : ""
      }`}
    >
      <h2>Pedido #{order_number}</h2>
      <div>
        <h3>Artículos:</h3>
        <ul>
          {order_items.map((item, index) => (
            <li key={index}>
              <span>Producto ID: {item.product_id}</span>
              <span>SKU: {item.sku}</span>
              <span>Precio: {item.price}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Total:</h3>
        <span>{total_price}</span>
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    order_number: PropTypes.string.isRequired,
    order_items: PropTypes.arrayOf(
      PropTypes.shape({
        product_id: PropTypes.string.isRequired,
        sku: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
    total_price: PropTypes.number.isRequired,
    validations: PropTypes.shape({
      negative: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

export default OrderCard;
