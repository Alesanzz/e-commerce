// @ts-nocheck
//importando las funciones de la clase product manager
import { CartModel } from "../../DAO/models/carts-model.js";
import { ProductModel } from "../../DAO/models/products-model.js";

class CartApiService {
  async getAllCarts() {
    const carts = await CartModel.find({});
    return carts;
  }

  async getOneCart(idCart) {
    const cart = await CartModel.findOne({ _id: idCart });
    return cart;
  }

  async addCart() {
    const newCart = await CartModel.create({});
    return newCart;
  }

  async addProductToCart(idCart, idProduct) {
    // Buscar el carrito en la base de datos
    const cart = await CartModel.findOne({ _id: idCart });

    if (cart) {
      // Verificar si el producto ya existe en el carrito
      const product = cart.products.find(
        (product) => product.product.toString() === idProduct
      );
      if (product) {
        // El producto ya existe en el carrito, incrementar la cantidad
        product.quantity += 1;
      } else {
        // El producto no existe en el carrito, buscarlo en la base de datos de productos
        const productToAdd = await ProductModel.findById(idProduct);

        if (productToAdd) {
          // Agregar el producto al carrito
          cart.products.push({
            product: productToAdd._id,
            quantity: 1,
          });
        }
      }
      // Guardar los cambios en el carrito en la base de datos
      await cart.save();
    }
  }

  async clearCart(idCart) {
    const cart = await CartModel.findOne({ _id: idCart });
    cart.products = [];
    await cart.save();
  }

  async deleteCart(_id) {
    const deleted = await CartModel.deleteOne({ _id: _id });
    return deleted;
  }
}

export const cartApiService = new CartApiService();
