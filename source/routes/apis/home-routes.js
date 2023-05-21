import express from "express";

export const routerHome = express.Router();

routerApiHome.get("/", (req, res) => {
  return res.status(200).json({
    status: "Success",
    msg: "Bienvenido a la pagina web de Alejandro Sanz, actualmente cuenta con la funcion de un controlador de productos",
    data: {},
  });
})