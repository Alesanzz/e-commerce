import express from "express";
import { usersApiController } from "../../controller/apis/users-api-controller.js";

export const routerApiUsers = express.Router();

//todos los usuarios
routerApiUsers.get("/", usersApiController.getAllUsers)
