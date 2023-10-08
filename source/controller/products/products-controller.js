//@ts-check
import CustomError from '../../services/errors/custom-error.js';
import EErrors from '../../services/errors/enums.js';
import { logger } from '../../config/logger-config.js';
import { productService } from "../../services/products/products-service.js";
import UserDTO from "../../dto/user-dto.js";

export const productController = {
  getAllProducts: async function (req, res, next) {
    let user = {}
    if (req.session && req.session.user) {
      user = new UserDTO(req.session.user)
    }else{
      user = {}
    }

    try {
      let { limit, page, query, sort } = req.query;
      const allProducts = await productService.getProducts(
        Number(limit),
        Number(page),
        query,
        sort
      );

      return res.status(200).render("products-views/products-list", {
        title: "Lista de productos",
        user: user,
        products: allProducts.docs.map((product) => ({
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
      logger.error('Error viewing all products: ' + error.message);

      return next(
				CustomError.createError({
					name: 'ViewAllProductsError',
					cause: error,
					message: 'Error viewing all products',
					code: EErrors.DATABASE_ERROR,
				}),
			);
    }
  },
};
