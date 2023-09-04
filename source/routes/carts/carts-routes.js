import express from "express";
import { cartController } from "../../controller/carts/carts-controller.js";

export const routerCarts = express.Router();

//un solo carrito de compra
routerCarts.get("/:id_cart", cartController.showOneCart)
//agregar un producto al carrito de compras
routerCarts.post("/:id_cart/product/:id_product", cartController.addProductToACart)
//elimina un producto del carrito de compras
routerCarts.delete("/:id_cart/products/:id_product", cartController.removeProductFromCart)
//vaciar por completo un carrito de compras
routerCarts.delete("/clean/:id_cart", cartController.clearOneCart)
