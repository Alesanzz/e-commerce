import express from "express";
import { userController } from "../../controller/users/users-controller.js";
import { checkUser, checkAdmin  } from "../../middlewares/auth-users/users-session.js";

export const routerUsers = express.Router();

//para registrar un nuevo usuario
routerUsers.get("/register", userController.register)
routerUsers.post("/register/create", userController.save)

//para ingresar el usuario
routerUsers.get("/login", userController.login)
routerUsers.post("/login/into", userController.access)

//para desloguearse y eliminar la session
routerUsers.get("/logout", userController.logout)

