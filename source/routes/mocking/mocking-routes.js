import express from "express";
import { mockingController } from "../../controller/mocking/mocking-controller.js";

export const routerMocking = express.Router();

//endpoint para crear nuevos productos
routerMocking.get("/products", mockingController.createProductsMocks)
//endpoint para crear nuevos usuarios
routerMocking.get("/users", mockingController.createUsersMocks)