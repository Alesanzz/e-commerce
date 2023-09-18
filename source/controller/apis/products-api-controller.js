//@ts-check
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../config/logger.config.js";
import { productService } from "../../services/products/products-service.js";

export const productsApiController = {
  getAllProducts: async function (req, res, next) {
    try {
      let { limit, page, query, sort } = req.query;
      const products = await productService.getProducts(
        limit,
        page,
        query,
        sort
      );

      return res.status(200).json({
        status: "Success",
        msg: "Mostrando todos los productos encontrados con exito",
        data: products,
      });
    } catch (error) {
      logger.error("Error retrieving all products: " + error.message);

      return next(
        CustomError.createError({
          name: "GetAllProductsError",
          cause: error,
          message: "Error retrieving all products",
          code: EErrors.DATABASE_ERROR,
        })
      );
    }
  },

  showOneProduct: async function (req, res, next) {
    try {
      const id = req.params.id;
      const product = await productService.getOneProduct(id);

      return res.status(200).json({
        status: "Success",
        msg: "Producto encontrado con exito",
        data: product,
      });
    } catch (error) {
      logger.error("Error retrieving product by ID: " + error.message);

      return next(
        CustomError.createError({
          name: "GetProductByIdError",
          cause: error,
          message: "Error retrieving product by ID",
          code: EErrors.PRODUCT_NOT_FOUND,
        })
      );
    }
  },

  createOneProduct: async function (req, res, next) {
    try {
      const newInfo = req.body;
      await productService.addProduct(newInfo);
      const products = await productService.getAllProducts();

      return res.status(201).json({
        status: "Success",
        msg: "Producto creado con exito",
        data: products[products.length - 1],
      });
    } catch (error) {
      logger.error("Error creating product: " + error.message);

      return next(
        CustomError.createError({
          name: "CreateProductError",
          cause: error,
          message: "Error creating product",
          code: EErrors.PRODUCT_VALIDATION_ERROR,
        })
      );
    }
  },

  updateOneProduct: async function (req, res, next) {
    try {
      const id = req.params.id;
      const dataToUpdate = req.body;
      await productService.updateProduct(id, dataToUpdate);

      const products = await productService.getAllProducts();
      const index = products.findIndex((p) => p.id == id);

      return res.status(201).json({
        status: "Success",
        msg: "Se pudo actualizar exitosamente el producto con el id " + id,
        data: products[index],
      });
    } catch (error) {
      logger.error("Error updating product: " + error.message);

      return next(
        CustomError.createError({
          name: "UpdateProductError",
          cause: error,
          message: "Error updating product",
          code: EErrors.PRODUCT_VALIDATION_ERROR,
        })
      );
    }
  },

  deleteOneProduct: async function (req, res, next) {
    try {
      const id = req.params.id;
      const deletedProduct = await productService.deleteProduct(id);
      if (deletedProduct) {
        return res.status(200).json({
          status: "Success",
          msg: "Se elimino el producto con el id " + id,
          data: {},
        });
      } else {
        return res.status(404).json({
          status: "Success",
          msg: "product could not be deleted, the id is: " + id,
          data: {},
        });
      }
    } catch (error) {
      logger.error("Error deleting product: " + error.message);

      return next(
        CustomError.createError({
          name: "DeleteProductError",
          cause: error,
          message: "Error deleting product",
          code: EErrors.DATABASE_ERROR,
        })
      );
    }
  },
};
