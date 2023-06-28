import express from "express";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../firebase/firebase.js";
import { processOrders } from "../services/orderService.js"
import { db } from "../firebase/firebase.js";


const router = express.Router();

router.get("/orders", async (req, res) => {
  try {
    const orders = await getOrders();
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener los pedidos" });
  }
});

router.get("/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await getOrderById(orderId);
    res.status(200).json({ order });
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener el pedido" });
  }
});

router.put("/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    await updateOrderStatus(orderId, status);
    res
      .status(200)
      .json({ message: "Estado del pedido actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    res.status(500).json({
      error: "Ocurrió un error al actualizar el estado del pedido",
    });
  }
});

router.post("/orders/process", async (req, res) => {
  try {
    const processedOrders = await processOrders();
    const batch = db.batch();

    processedOrders.forEach((order) => {
      const orderRef = db.collection("processed_orders").doc();
      batch.set(orderRef, order);
    });

    await batch.commit();

    res.status(200).json({ message: "Pedidos procesados exitosamente" });
  } catch (error) {
    console.error("Error al procesar los pedidos:", error);
    res.status(500).json({ error: "Ocurrió un error al procesar los pedidos" });
  }
});



export default router;
