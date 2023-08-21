//@ts-check
//importando las funciones de la carpeta services
import { productService } from "../../services/products/products-service.js";

export const productsApiController = {
  getAllProducts: async function (req, res) {
    try {
      let { limit, page, query, sort } = req.query;
      const products = await productService.getProducts(
        limit,
        page,
        query,
        sort
      );

      return res.status(200).json({
        status: "Success",
        msg: "Mostrando todos los productos encontrados con exito",
        data: products,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong",
        data: { error },
      });
    }
  },

  showOneProduct: async function (req, res) {
    try {
      const id = req.params.id;
      const product = await productService.getOneProduct(id);

      return res.status(200).json({
        status: "Success",
        msg: "Producto encontrado con exito",
        data: product,
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        msg: "product could not be found",
        data: { error },
      });
    }
  },

  createOneProduct: async function (req, res) {
    try {
      const newInfo = req.body;
      await productService.addProduct(newInfo);
      const products = await productService.getAllProducts();

      return res.status(201).json({
        status: "Success",
        msg: "Producto creado con exito",
        data: products[products.length - 1],
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        msg: "product could not be created",
        data: { error },
      });
    }
  },

  updateOneProduct: async function (req, res) {
    try {
      const id = req.params.id;
      const dataToUpdate = req.body;
      await productService.updateProduct(id, dataToUpdate);

      const products = await productService.getAllProducts();
      const index = products.findIndex((p) => p.id == id);

      return res.status(201).json({
        status: "Success",
        msg: "Se pudo actualizar exitosamente el producto con el id " + id,
        data: products[index],
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        msg: "product could not be updated",
        data: { error },
      });
    }
  },

  deleteOneProduct: async function (req, res) {
    try {
      const id = req.params.id;
      const deletedProduct = await productService.deleteProduct(id);
      if (deletedProduct) {
        return res.status(200).json({
          status: "Success",
          msg: "Se elimino el producto con el id " + id,
          data: {},
        });
      } else {
        return res.status(404).json({
          status: "Success",
          msg: "product could not be deleted, the id is: " + id,
          data: {},
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "Internal server error",
        data: { error },
      });
    }
  },
};
