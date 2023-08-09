//@ts-check
//importando las funciones de la carpeta services
import { productApiService } from "../../services/apis/products-api-service.js";

export const productRealtimeController = {
  index: async function (req, res) {
    try {
      console.log("cliente conectado a la lista de productos");
      //const products = await productApiService.getProducts();

      let { limit, page, query, sort } = req.query;
      const products = await productApiService.getProducts(
        limit,
        page,
        query,
        sort
      );

      return res.render("realtime-views/real-time-products", {
        title: "Lista de productos",
        style: "realtime/products.css",
        
        products: products.docs.map((product) => ({
          id: product._id.toString(),
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          code: product.code,
          stock: product.stock,
          thumbnail: product.thumbnail,
        })),
        pagingCounter: products.pagingCounter,
        page: products.page,
        totalPages: products.totalPages,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage, 
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
