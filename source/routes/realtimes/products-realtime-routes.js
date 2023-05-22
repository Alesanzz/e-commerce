import express from "express";
import { productRealtimeController } from "../../controller/products-realtime-controller.js";

export const routerRealTimeProducts = express.Router();

//todos los productos
routerRealTimeProducts.get("/", productRealtimeController.index)