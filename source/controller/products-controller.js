//importando las funciones de la clase product manager
import { productManager } from "../modules/products-manager.js";

export const productController = {
  index: async function (req, res) {
    try {
      const products = await productManager.getProducts();
      return res.render("products-views/products-list", { title: "Socket Server", products: products });
    } catch (error) {
      return res.status(500).json({ succes: "false", msg: error });
    }
  },
};
