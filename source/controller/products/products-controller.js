//@ts-check
//importando las funciones de la carpeta services
import UserDTO from "../../dto/user-dto.js";
import { productService } from "../../services/products/products-service.js";

export const productController = {
  getAllProducts: async function (req, res) {
    let user = {}
    if (req.session && req.session.user) {
      user = new UserDTO(req.session.user)
    }else{
      user = {}
    }

    try {
      let { limit, page, query, sort } = req.query;
      const allProducts = await productService.getProducts(
        limit,
        page,
        query,
        sort
      );

      return res.status(200).render("products-views/products-list", {
        title: "Lista de productos",
        user: user,
        products: allProducts.map((product) => ({
          id: product._id.toString(),
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          stock: product.stock,
          thumbnail: product.thumbnail,
        })),
        pagingCounter: allProducts.pagingCounter,
        page: allProducts.page,
        totalPages: allProducts.totalPages,
        hasPrevPage: allProducts.hasPrevPage,
        hasNextPage: allProducts.hasNextPage,
        prevPage: allProducts.prevPage,
        nextPage: allProducts.nextPage,
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
