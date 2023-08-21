import CartModel from "./models/carts-model.js";

class CartMongoDAO {
  async findAll() {
    return await CartModel.find();
  }

  async findOne(code) {
    return await CartModel.findById({ _id: code }).populate("products.product");
  }

  async create(cartData) {
    return await CartModel.create(cartData);
  }

  async updateOne(code, cartData) {
    return await CartModel.findByIdAndUpdate({ _id: code }, cartData, {
      new: true,
    });
  }

  async addProduct(cartId, productData) {
    const cart = await CartModel.findById({ _id: cartId });
    cart.products.push(productData);
    return await cart.save();
  }

  async deleteProduct(cartId, productId) {
    const cart = await CartModel.findById({ _id: cartId });
    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );
    return await cart.save();
  }

  async deleteOne(code) {
    return await CartModel.findOneAndDelete({ _id: code });
  }
}

export default new CartMongoDAO();
