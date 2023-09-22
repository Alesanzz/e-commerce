//@ts-check
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../config/logger-config.js";
import { cartService } from "../../services/carts/carts-service.js";

export const cartsApiController = {
  getAllCarts: async function (req, res, next) {
    try {
      let { limit, page, query, sort } = req.query;
      const carts = await cartService.getCarts(limit, page, query, sort);

      return res.json({
        status: "Success",
        msg: "Mostrando todos los carritos de compra encontrados con exito",
        data: carts,
      });
    } catch (error) {
      logger.error("Error retrieving all carts: " + error.message);

			return next(
				CustomError.createError({
					name: 'GetAllCartsError',
					cause: error,
					message: 'Error retrieving all carts',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
  },

  showOneCart: async function (req, res, next) {
    try {
      const idCart = req.params.id_cart;
      const cart = await cartService.getOneCart(idCart);

      return res.status(200).json({
        status: "Success",
        msg: "Carrito de compras encontrado con exito",
        data: cart,
      });
    } catch (error) {
      logger.error("Error retrieving the cart by ID: " + error.message);

			return next(
				CustomError.createError({
					name: 'GetCartByIdError',
					cause: error,
					message: 'Error retrieving cart by ID',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
  },

  createOneCart: async function (req, res, next) {
    try {
      await cartService.addCart();
      const carts = await cartService.getAllCarts();

      return res.status(201).json({
        status: "Success",
        msg: "Carrito de compras creado con exito",
        data: carts[carts.length - 1],
      });
    } catch (error) {
			logger.error('Error creating cart: ' + error.message);

			return next(
				CustomError.createError({
					name: 'CreateCartError',
					cause: error,
					message: 'Error creating cart',
					code: EErrors.CART_VALIDATION_ERROR,
				}),
			);
		}
  },

  addProductToACart: async function (req, res, next) {
    try {
      const idCart = req.params.id_cart;
      const idProduct = req.params.id_product;
      await cartService.addProductToCart(idCart, idProduct);

      let cartUpdated = await cartService.getOneCart(idCart);

      return res.status(201).json({
        status: "Success",
        msg: "Producto agregado al carrito de compras exitosamente",
        data: cartUpdated,
      });
    } catch (error) {
			logger.error('Error adding product to cart: ' + error.message);

			return next(
				CustomError.createError({
					name: 'AddProductToCartError',
					cause: error,
					message: 'Error adding product to cart',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
  },

  updateProductQuantity: async function (req, res, next) {
    try {
      const idCart = req.params.id_cart;
      const idProduct = req.params.id_product;
      const quantity = parseInt(req.body.quantity)
      await cartService.updateProductQuantity(idCart, idProduct, quantity);

      let cartUpdated = await cartService.getOneCart(idCart);

      return res.status(201).json({
        status: "Success",
        msg: "Actualizado la cantidad de productos deseado en el carrito de compras",
        data: cartUpdated,
      });
    } catch (error) {
      logger.error('Error updating cart: ' + error.message);

			return next(
				CustomError.createError({
					name: 'UpdateCartError',
					cause: error,
					message: 'Error updating cart',
					code: EErrors.CART_VALIDATION_ERROR,
				}),
			);
		}
  },

  removeProductFromCart: async function (req, res, next) {
    try {
      const idCart = req.params.id_cart;
      const idProduct = req.params.id_product;
      await cartService.removeProductFromCart(idCart, idProduct);

      let cartUpdated = await cartService.getOneCart(idCart);

      return res.status(201).json({
        status: "Success",
        msg: "Productos eliminado del carrito de compras",
        data: cartUpdated,
      });
    } catch (error) {
			logger.error('Error removing product from cart: ' + error.message);

			return next(
				CustomError.createError({
					name: 'DeleteProductFromCartError',
					cause: error,
					message: 'Error removing product from cart',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
  },

  clearOneCart: async function (req, res, next) {
    try {
      const id = req.params.id_cart;
      const cart = await cartService.clearCart(id);

      return res.status(200).json({
        status: "Success",
        msg: "Se vacio el carrito de compras con el id " + id,
        data: { cart },
      });
    } catch (error) {
      logger.error('Error clearing cart: ' + error.message);

			return next(
				CustomError.createError({
					name: 'ClearCartError',
					cause: error,
					message: 'Error clearing cart',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
  },

  deleteOneCart: async function (req, res, next) {
    try {
      const id = req.params.id;
      const deletedCart = await cartService.deleteCart(id);
      if (deletedCart) {
      return res.status(200).json({
        status: "Success",
        msg: "Se elimino el carrito de compras con el id " + id,
        data: {},
      });
    } else {
      return res.status(404).json({
        status: "Success",
        msg: "cart could not be deleted, the id is: " + id,
        data: {},
      });
    }
    } catch (error) {
      logger.error('Error deleting cart: ' + error.message);

			return next(
				CustomError.createError({
					name: 'ClearCartError',
					cause: error,
					message: 'Error deleting cart',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
  },
};
