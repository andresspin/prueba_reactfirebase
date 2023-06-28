import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno de .env

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getOrders = async () => {
  const ordersRef = collection(db, "orders");
  const ordersSnapshot = await getDocs(ordersRef);
  const orders = [];

  ordersSnapshot.forEach((doc) => {
    orders.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return orders;
};

export const getOrderById = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);
  const orderSnapshot = await getDoc(orderRef);

  if (orderSnapshot.exists()) {
    return {
      id: orderSnapshot.id,
      ...orderSnapshot.data(),
    };
  } else {
    throw new Error("Pedido no encontrado");
  }
};

export const updateOrderStatus = async (orderId, status) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: status,
  });
};

export default app;
