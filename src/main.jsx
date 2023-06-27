import  { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import OrderCard from "./components/OrderCard";

const App = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
