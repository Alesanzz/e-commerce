import ProductModel from "./models/products-model.js";

class ProductMongoDAO {
  async findAll() {
    return await ProductModel.find();
  }

  async findSome(filter, options) {
    return await ProductModel.paginate(filter, options);
  }

  async findOne(code) {
    return await ProductModel.findOne({ _id: code });
  }

  async create(product) {
    return await ProductModel.create(product);
  }

  async createMany(product) {
    return await ProductModel.insertMany(product);
  }

  async updateOne(code, product) {
    return await ProductModel.findOneAndUpdate({ _id: code }, product, {
      new: true,
    });
  }

  async deleteOne(code) {
    return await ProductModel.findOneAndDelete({ _id: code });
  }
}

export default new ProductMongoDAO();
