//@ts-check
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../config/logger.config.js";
import { cartService } from "../../services/carts/carts-service.js";
import UserDTO from "../../dto/user-dto.js";

export const cartController = {
  showOneCart: async function (req, res, next) {
    let user = {}
    if (req.session && req.session.user) {
      user = new UserDTO(req.session.user)
    }else{
      user = {}
    }

    try {
      const id = req.params.id_cart;
      const cart = await cartService.getOneCart(id);
      const theCart = cart.products.map((prod) => prod.toJSON());

      return res.status(200).render("carts-views/carts-list", {
        title: "Detalle del carro",
        user: user,
        cart: theCart,
      });
    } catch (error) {
      logger.error("Error viewing the cart by ID: " + error.message);

			return next(
				CustomError.createError({
					name: 'GetCartByIdError',
					cause: error,
					message: 'Error viewing cart by ID',
					code: EErrors.DATABASE_ERROR,
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

      return res.status(201).redirect("/products");
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

  removeProductFromCart: async function (req, res, next) {
    try {
      const idCart = req.params.id_cart;
      const idProduct = req.params.id_product;
      await cartService.removeProductFromCart(idCart, idProduct);

      let cartUpdated = await cartService.getOneCart(idCart);

      return res.status(201).redirect(`/carts/${idCart}`);
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

      return res.status(201).redirect("/products");
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

  purchaseCart: async function (req, res, next) {
    try {
      const idCart = req.params.id_cart;
      const email = req.session.user.email;

      const result = await cartService.finalizePurchase(idCart, email);

      return res.status(201).redirect("/products");
    } catch (error) {
			logger.error('Error finalizing purchase: ' + error.message);

			return next(
				CustomError.createError({
					name: 'FinalizePurchaseError',
					cause: error,
					message: 'Error finalizing purchase',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	}
};
