import express from "express";
import { cartsApiController } from "../../controller/apis/carts-api-controller.js";

export const routerApiCarts = express.Router();

//todos los carritos de compra
routerApiCarts.get("/", cartsApiController.getAllCarts)
//un solo carrito de compra
routerApiCarts.get("/:id_cart", cartsApiController.showOneCart)
//crear un carrito de compras nuevo
routerApiCarts.post("/", cartsApiController.createOneCart)
//agregar un producto al carrito de compras
routerApiCarts.post("/:id_cart/product/:id_product", cartsApiController.addProductToACart)
//vaciar por completo un carrito de compras
routerApiCarts.post("/:id_cart", cartsApiController.clearOneCart)
//eliminar un carrito de compras
routerApiCarts.delete("/:id", cartsApiController.deleteOneCart)
