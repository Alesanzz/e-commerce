import express from "express";

//importando las funciones de la clase product manager
import { productManager } from "../../modules/products-manager.js";
const products = productManager.getProducts();

export const routerApiProducts = express.Router();

//todos los productos
routerProducts.get("/", (req, res) => {
  const limit = req.query.limit;

  if (req.query && limit && limit <= products.length) {
    const productsLimited = products.slice(0, limit);
    return res.status(200).json({
      status: "Success",
      msg:
        "Mostrando la cantidad de los primeros " +
        limit +
        " productos de la base datos",
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
routerProducts.get("/:id", (req, res) => {
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

//crear un producto
routerProducts.post("/", (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);

  if (newProduct) {
    return res.status(201).json({
      status: "Success",
      msg: "Producto creado con exito",
      data: newProduct,
    });
  } else {
    //aqui deberia poder colocar los errores que por ahora salen por la consola
    return res.status(404).json({
      status: "Error",
      msg: "Producto imposible de crear",
      data: {},
    });
  }
});

//modificar un profucto
routerProducts.put("/:id", (req, res) => {
  const id = req.params.id;
  const dataToUpdate = req.body;
  const index = products.findIndex((p) => p.id == id);

  if (index == -1) {
    return res.status(404).json({
      status: "Error",
      msg: "Producto inexistente",
      data: {},
    });
  } else {
    productManager.updateProduct(id, dataToUpdate);

    return res.status(201).json({
      status: "Success",
      msg: "Se pudo actualizar exitosamente el producto con el id " + id,
      data: products[index],
    });
  }
});

//eliminar un producto
routerProducts.delete("/:id", (req, res) => {
    const id = req.params.id;
    productManager.deleteProduct(id)
  
    return res.status(200).json({
      status: "Success",
      msg: "Se elimino el producto con el id " + id,
      data: {},
    });
  });
