//importando las funciones de la clase product manager
import { DAOFactory } from "../../dao/factory.js";
import { productService } from "../products/products-service.js";
import { ticketService } from "../tickets/tickets-service.js";

const cartDAO = await DAOFactory("carts");

class CartService {
  async getCarts(limit, page, query, sort) {
    const filter = query ? { title: { $regex: query, $options: "i" } } : {};
    const sortOption = sort == "asc" ? { price: 1 } : { price: -1 };

    const options = {
      limit: limit || 5,
      page: page || 1,
      sort: sortOption,
    };

    const carts = await cartDAO.findAll({ filter, options });
    return carts;
  }

  async getAllCarts() {
    const carts = await cartDAO.findAll({});
    return carts;
  }

  async getOneCart(idCart) {
    const cart = await cartDAO.findOne(idCart);
    return cart;
  }

  async addCart() {
    const newCart = await cartDAO.create({});
    return newCart;
  }

  async addProductToCart(idCart, idProduct) {
    // Buscar el carrito en la base de datos
    const cart = await cartDAO.findOne(idCart);

    if (cart) {
      // Verificar si el producto ya existe en el carrito
      const product = cart.products.find(
        (product) => product.product._id.toString() === idProduct
      );
      if (product) {
        // El producto ya existe en el carrito, incrementar la cantidad
        product.quantity += 1;
      } else {
        // El producto no existe en el carrito, buscarlo en la base de datos de productos
        const productToAdd = await productService.getOneProduct(idProduct);

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

  async updateCart(cartId, products) {
		try {
			return await cartDAO.updateOne(cartId, {products});
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

  async updateProductQuantity(idCart, idProduct, quantity) {
    // Buscar el carrito en la base de datos
    const cart = await cartDAO.findOne(idCart);

    if (cart) {
      // Buscar el producto en el carrito
      const product = cart.products.find(
        (product) => product.product._id.toString() === idProduct
      );
      if (product) {
        // Actualizar la cantidad del producto en el carrito
        product.quantity = quantity;
      }
      // Guardar los cambios en el carrito en la base de datos
      await cart.save();
    }
  }

  async removeProductFromCart(idCart, idProduct) {
    // Buscar el carrito en la base de datos
    const cart = await cartDAO.findOne(idCart);

    if (cart) {
      // Verificar si el producto existe en el carrito
      const productIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === idProduct
      );
      if (productIndex !== -1) {
        // El producto existe en el carrito, eliminarlo
        cart.products.splice(productIndex, 1);
      }
      // Guardar los cambios en el carrito en la base de datos
      await cart.save();
    }
  }

  async clearCart(idCart) {
    let cart = await cartDAO.findOne(idCart);
    cart.products = [];
    cart = await cart.save();
    return cart;
  }

  async deleteCart(_id) {
    const deleted = await cartDAO.deleteOne(_id);
    return deleted;
  }

  async finalizePurchase(cartId, email) {
		try {
			const cart = await this.getOneCart(cartId);
			let totalAmount = 0;
			let unprocessedProducts = [];
      let productsForTheTicket = []

			for (let item of cart.products) {
				const product = await productService.getOneProduct(item.product);
        productsForTheTicket.push({product: item.product._id, quantity: item.quantity})

				if (product.stock >= item.quantity) {
					totalAmount += product.price * item.quantity;
					product.stock -= item.quantity;
					await productService.updateProduct(product._id, product);
				} else {
					unprocessedProducts.push(item.product);
				}
			}

			const ticketData = {
				purchaser: email,
        cartId: cartId,
        products: productsForTheTicket,
				amount: totalAmount,
			};

			const ticket = await ticketService.createTicket(ticketData);

			cart.products = cart.products.filter(item =>
				unprocessedProducts.includes(item.product),
			);
			await this.updateCart(cartId, cart.products);

			return {
				ticket,
				unprocessedProducts,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

export const cartService = new CartService();
