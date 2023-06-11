//importando las funciones de la carpeta services
import { productService } from "../../services/products/products-service.js";

export const productController = {
  getAllProducts: async function (req, res) {
    try {
      const products = await productService.getAllProducts();

      return res.render("products-views/products-list", {
        title: "Lista de productos",
        products: products,
      });
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
