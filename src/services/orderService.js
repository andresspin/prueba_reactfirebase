import { db } from "../firebase/firebase";

export const processOrders = async () => {
  const ordersRef = db.collection("orders");
  const ordersSnapshot = await ordersRef.get();

  const processedOrders = [];

  ordersSnapshot.forEach(async (doc) => {
    const orderData = doc.data();
    const { order_items, total_price } = orderData;

    // Validar suma de precios de artículos
    const calculatedTotalPrice = order_items.reduce(
      (total, item) => total + item.price,
      0
    );

    const totalPriceValid = calculatedTotalPrice === total_price;

    // Verificar IDs de productos y SKUs válidos
    const validItems = order_items.every(
      (item) =>
        item.product_id &&
        item.sku &&
        item.product_id !== "" &&
        item.sku !== "" &&
        item.product_id > 0 &&
        item.sku > 0
    );

    if (totalPriceValid && validItems) {
      // Obtener sku_img_src de la colección "products"
      const productPromises = order_items.map(async (item) => {
        const productDoc = await db
          .collection("products")
          .doc(item.product_id)
          .get();
        const productData = productDoc.data();
        return productData.sku_img_src;
      });

      const skuImgSrc = await Promise.all(productPromises);

      // Guardar pedido procesado con datos adicionales y timestamp
      const processedOrder = {
        ...orderData,
        validations: {
          negative: false, // Esta propiedad deberá actualizarse si se encuentra alguna validación negativa
        },
        sku_img_src: skuImgSrc,
        verification_timestamp: Date.now(),
      };

      processedOrders.push(processedOrder);
    } else {
      // Pedido con validaciones negativas
      const processedOrder = {
        ...orderData,
        validations: {
          negative: true,
        },
        sku_img_src: [],
        verification_timestamp: Date.now(),
      };

      processedOrders.push(processedOrder);
    }
  });

  return processedOrders;
};
