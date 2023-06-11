//importando las funciones de la carpeta services
import { productRealtimeService } from "../../services/realtime/products-realtime-service.js";

export const productRealtimeController = {
  index: async function (req, res) {
    try {
      console.log("cliente conectado");
      const products = await productRealtimeService.getAllProducts();

      return res.render("real-time-products", { title: "Lista de productos", products: products });

    } catch (error) {
      return res
        .status(500)
        .json({
          status: "error",
          msg: "something went wrong",
          data: { error },
        });
    }
  },
};
