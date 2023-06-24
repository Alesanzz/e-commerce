//importando las funciones de la clase product manager
import { productManager } from "../../DAO/products-manager.js";

class ProductRealtimeService {
  async getAllProducts() {
    const products = await productManager.getProducts();
    return products
  }
}

export const productRealtimeService = new ProductRealtimeService

