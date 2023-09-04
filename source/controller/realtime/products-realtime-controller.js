//@ts-check
//importando las funciones de la carpeta services
import { productService } from "../../services/products/products-service.js";

export const productRealtimeController = {
  index: async function (req, res) {
    try {
      console.log("cliente conectado a la lista de productos");

      let { limit, page, query, sort } = req.query;
      const products = await productService.getProducts(
        limit,
        page,
        query,
        sort
      );

      return res.render("realtime-views/real-time-products", {
        title: "Lista de productos",
        style: "realtime/products.css",
        
        products: products.map((product) => ({
          id: product._id.toString(),
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          code: product.code,
          stock: product.stock,
          thumbnail: product.thumbnail,
        })),
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong",
        data: { error },
      });
    }
  },
};
