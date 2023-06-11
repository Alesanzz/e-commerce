//importando las funciones de la clase product manager
import { productManager } from "../../DAO/models/products-manager.js";

class ProductService {
  async getAllProducts() {
    const products = await productManager.getProducts();
    return products
  }
}

export const productService = new ProductService
