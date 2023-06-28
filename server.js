import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ordersRouter from "./src/routes/orders.js";

// Configurar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Configurar los encabezados CORS
app.use(cors());

// Middleware para el manejo de JSON
app.use(express.json());

// Rutas
app.use("/", ordersRouter);

// Puerto del servidor
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
