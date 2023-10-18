class CartMemoryDAO {
  constructor() {
    this.carts = [];
    this.currentId = 1;
  }

  async findAll() {
    return this.carts;
  }

  async findOne(code) {
    return this.carts.find((cart) => cart._id == code);
  }

  async create(cartData) {
    const newCart = { ...cartData, _id: this.currentId++ };
    this.carts.push(newCart);
    return newCart;
  }

  async updateOne(code, cartData) {
    const index = this.carts.findIndex((c) => c._id == code);
    if (index == -1) return null;
    this.carts[index] = { ...this.carts[index], ...cartData };
    return this.carts[index];
  }

  async addProduct(cartId, productData) {
    const cart = this.carts.find((car) => car._id == cartId);
    if (!cart) return null;
    cart.products.push(productData);
    return cart;
  }

  async deleteProduct(cartId, productId) {
    const cart = this.carts.find((car) => car._id == cartId);
    if (!cart) return null;
    cart.products = cart.products.filter((p) => p.product != productId);
    return cart;
  }

  async deleteOne(code) {
    const index = this.carts.findIndex((c) => c._id == code);
    if (index == -1) return null;
    const deletedCart = this.carts.splice(index, 1);
    return deletedCart[0];
  }
}

export default new CartMemoryDAO();
