import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import axios from "axios";
import OrderCard from "./OrderCard";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByTimestamp, setSortByTimestamp] = useState(true);
  const [lastVisibleOrder, setLastVisibleOrder] = useState(null);
  const ordersRef = firebase.firestore().collection("orders");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = ordersRef
        .orderBy("timestamp", sortByTimestamp ? "desc" : "asc")
        .limit(5);

      if (lastVisibleOrder) {
        query = query.startAfter(lastVisibleOrder);
      }

      const snapshot = await query.get();
      const newOrders = snapshot.docs.map((doc) => doc.data());

      setOrders((prevOrders) => [...prevOrders, ...newOrders]);
      setLastVisibleOrder(snapshot.docs[snapshot.docs.length - 1]);

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      setLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setOrders([]);
    setSortByTimestamp((prevSortByTimestamp) => !prevSortByTimestamp);
    setLastVisibleOrder(null);
  };

  useEffect(() => {
    fetchOrders();
  }, [sortByTimestamp]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        fetchOrders();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [orders]);

  return (
    <div>
      <h1>Pedidos</h1>
      <button onClick={toggleSortOrder}>
        Cambiar orden (
        {sortByTimestamp
          ? "Más antiguo a más reciente"
          : "Más reciente a más antiguo"}
        )
      </button>
      {orders.map((order) => (
        <Link key={order.order_number} to={`/orders/${order.order_number}`}>
          <OrderCard order={order} />
        </Link>
      ))}
      {loading && <p>Cargando pedidos...</p>}
    </div>
  );
};

export default OrdersPage;
