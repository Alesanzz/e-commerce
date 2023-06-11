//importando las funciones de la clase product manager
import { productManager } from "../../DAO/models/products-manager.js";

class ProductApiService {
  async getAllProducts() {
    const products = await productManager.getProducts();
    return products;
  }

  async getOneProduct(id) {
    const product = await productManager.getProductsById(id);
    return product;
  }

  async addProduct(newInfo) {
    const newProduct = await productManager.addProduct(newInfo);
    return newProduct;
  }

  async updateProduct(id, dataToUpdate) {
    const productUpdated = await productManager.updateProduct(id, dataToUpdate);
    return productUpdated;
  }

  async deleteProduct(id) {
    await productManager.deleteProduct(id);
  }
}

export const productApiService = new ProductApiService();
