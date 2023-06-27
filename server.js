import express from "express";
import dotenv from "dotenv";
import ordersRouter from "./src/routes/orders.js";


// Configurar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Middleware para el manejo de JSON
app.use(express.json());

// Rutas
app.use("/orders", ordersRouter);

// Puerto del servidor
const port = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
