import express from "express";

//importando las funciones de la clase carts manager
import { cartsManager } from "../../modules/carts-manager.js";
const carts = cartsManager.getCarts();

export const routerApiCarts = express.Router();

//todos los carritos de compra
routerApiCarts.get("/", (req, res) => {
  return res.json({
    status: "Success",
    msg: "Mostrando todos los carritos encontrados con exito",
    data: carts,
  });
});

//un solo carrito de compra
routerApiCarts.get("/:id_cart", (req, res) => {
  const idCart = req.params.id_cart;
  let cart = carts.find((c) => c.idCart == idCart);

  if (cart) {
    return res.status(200).json({
      status: "Success",
      msg: "Carrito de compras encontrado con exito",
      data: cart,
    });
  } else {
    return res.status(404).json({
      status: "Error",
      msg: "Carrito de compras no encontrado",
      data: {},
    });
  }
});

//crear un carrito de compras nuevo
routerApiCarts.post("/", (req, res) => {
  cartsManager.addCart();

  return res.status(201).json({
    status: "Success",
    msg: "Carrito de compras creado con exito",
    data: newCart,
  });
});

//agregar un producto al carrito de compras
routerApiCarts.post("/:id_cart/product/:id_product", (req, res) => {
  const idCart = req.params.id_cart;
  const idProduct = req.params.id_product;
  const body = req.body;
  cartsManager.addProductToCart(idCart, idProduct, body);

  let cartUpdated = cartsManager.getCartsById(idCart)

  return res.status(201).json({
    status: "Success",
    msg: "Productos agregados al carrito de compras exitosamente",
    data: cartUpdated,
  });
});
