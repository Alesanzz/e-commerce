import express from "express";
import passport from 'passport';
import { userController } from "../../controller/users/users-controller-passaport.js";
import { checkRolAdmin } from "../../middlewares/auth-users/check-rol-admin.js"


export const routerUsers = express.Router();

//ver listado de usuarios solo para administradores
routerUsers.get("/list", checkRolAdmin, userController.list)

//ver el perfil
routerUsers.get("/profile", userController.showProfile)

//para registrar un nuevo usuario
routerUsers.get("/register", userController.register)
routerUsers.post("/register/create", passport.authenticate('register', { failureRedirect: '/users/auth/error' }), userController.save)

//para ingresar el usuario
routerUsers.get("/login", userController.login)
routerUsers.post("/login/into", passport.authenticate('login', { failureRedirect: '/users/auth/error' }), userController.access)

//para el ingreso de un usuario a traves de github
routerUsers.get("/github", passport.authenticate('github', { scope: ['user:email'] }))
routerUsers.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/users/auth/error' }), userController.githubLogin)

//para desloguearse y eliminar la session
routerUsers.get("/logout", userController.logout)

//rutas para recuperar la contraseña
routerUsers.get("/forgot-password", userController.forgotPassword);
routerUsers.post("/request-reset-password", userController.requestResetPassword);
routerUsers.get("/reset-password", userController.resetPassword);
routerUsers.post("/reset-password-done", userController.resetPasswordSave);

//ruta para cuando hay que eliminar un usuario solo para administradores
routerUsers.delete("/list/:id", checkRolAdmin, userController.deleteUser)

//ruta para cuando hay un problema
routerUsers.get("/auth/error", userController.error)