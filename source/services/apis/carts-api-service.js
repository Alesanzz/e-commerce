//importando las funciones de la clase product manager
import { cartManager } from "../../DAO/models/carts-manager.js";

class CartApiService {
  async getAllCarts() {
    const carts = await cartManager.getCarts();
    return carts;
  }

  async getOneCart(id) {
    const cart = await cartManager.getCartsById(id);
    return cart;
  }

  async addCart() {
    await cartManager.addCart();
  }

  async addProductToCart(idCart, idProduct) {
    const cartUpdated = await cartManager.addProductToCart(idCart, idProduct);
    return cartUpdated;
  }
}

export const cartApiService = new CartApiService();
