//requiriendo express basico y configurandolo
import express from "express";
const server = express();
const port = 8080;

//configuracion de rutas
import path from "path";

//la siguiente linea es para poder usar mejor el req.query, extendiendo las opciones
server.use(express.urlencoded({ extended: true }));
//para configurar de que el servidor siempre responda devolviendo archivos en formato json
server.use(express.json());

//importando las funciones de la clase product manager
import { productManager } from "./modules/product-manager.js"
const products = productManager.getProducts()

//home
server.get("/", (req, res) => {
  return res.status(200).json({
    status: "Success",
    msg: "Bienvenido a la pagina web de Alejandro Sanz, actualmente cuenta con la funcion de un controlador de productos",
    data: {},
  });
});

//todos los productos
server.get("/products", (req, res) => {
  const limit = req.query.limit;

  if (req.query && limit && (limit <= products.length)) {
    const productsLimited = products.slice(0, limit)
    return res.status(200).json({
      status: "Success",
      msg: "Mostrando la cantidad de los primeros " + limit + " productos de la base datos",
      data: productsLimited,
    });
  } else {
    return res.json({
      status: "Success",
      msg: "Mostrando todos los productos encontrados con exito",
      data: products,
    });
  }
});

//un solo producto
server.get("/products/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id == id);

  if (product) {
    return res.status(200).json({
      status: "Success",
      msg: "Producto encontrado con exito",
      data: product,
    });
  } else {
    return res.status(404).json({
      status: "Error",
      msg: "Producto no encontrado",
      data: {},
    });
  }
});

//cuando la ruta no existe
server.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "Error", msg: "La ruta no existe", data: {} });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });