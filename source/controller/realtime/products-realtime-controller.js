//@ts-check
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../config/logger-config.js";
import { productService } from "../../services/products/products-service.js";

export const productRealtimeController = {
  index: async function (req, res, next) {
    try {
      logger.info("cliente conectado a la lista de productos");

      const products = await productService.getAllProducts();

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
      logger.error("Error showing the product manager: " + error.message);

      return next(
        CustomError.createError({
          name: "ProductManagerError",
          cause: error,
          message: "Error showing the product manager",
          code: EErrors.DATABASE_ERROR,
        })
      );
    }
  },
};
