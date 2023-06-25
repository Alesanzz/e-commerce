//@ts-check
//importando las funciones de la carpeta services
import { productApiService } from "../../services/apis/products-api-service.js";

export const productController = {
  getAllProducts: async function (req, res) {
    try {
      const products = await productApiService.getAllProducts();

      return res.status(200).render("products-views/products-list", {
        title: "Lista de productos",
        products: products.map((product) => ({
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          stock: product.stock,
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
