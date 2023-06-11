//importando las funciones de la carpeta services
import { cartApiService } from "../../services/apis/carts-api-service.js";

export const cartsApiController = {
  getAllCarts: async function (req, res) {
    try {
      const carts = await cartApiService.getAllCarts();

      return res.json({
        status: "Success",
        msg: "Mostrando todos los carritos encontrados con exito",
        data: carts,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong",
        data: { error },
      });
    }
  },

  showOneCart: async function (req, res) {
    try {
      const idCart = req.params.id_cart;
      const cart = await cartApiService.getOneCart(idCart);

      return res.status(200).json({
        status: "Success",
        msg: "Carrito de compras encontrado con exito",
        data: cart,
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        msg: "cart could not be find",
        data: { error },
      });
    }
  },

  createOneCart: async function (req, res) {
    try {
      await cartApiService.addCart();

      return res.status(201).json({
        status: "Success",
        msg: "Carrito de compras creado con exito",
        data: {},
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        msg: "cart could not be find",
        data: { error },
      });
    }
  },

  addProductToACart: async function (req, res) {
    try {
      const idCart = req.params.id_cart;
      const idProduct = req.params.id_product;
      await cartApiService.addProductToCart(idCart, idProduct);
     
      let cartUpdated = await cartApiService.getOneCart(idCart);

      return res.status(201).json({
        status: "Success",
        msg: "Productos agregados al carrito de compras exitosamente",
        data: cartUpdated,
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        msg: "cart could not be find",
        data: { error },
      });
    }
  },
};
