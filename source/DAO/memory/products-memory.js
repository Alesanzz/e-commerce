class ProductMemoryDAO {
  constructor() {
    this.products = [];
    this.currentId = 1;
  }

  async findAll() {
    return this.products;
  }

  async findOne(code) {
    return this.products.find((product) => product.code == code);
  }

  async create(product) {
    const newProduct = { ...product, _id: this.currentId++ };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateOne(code, updatedProduct) {
    const index = this.products.findIndex((prod) => prod._id == code);
    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...updatedProduct };
    return this.products[index];
  }

  async deleteOne(code) {
    const index = this.products.findIndex((prod) => prod._id == code);
    if (index == -1) return null;

    const deletedProduct = this.products.splice(index, 1);
    return deletedProduct[0];
  }
}

export default new ProductMemoryDAO();
