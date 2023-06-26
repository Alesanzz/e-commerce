//@ts-check
//importando las funciones de la clase product manager
import { ProductModel } from "../../DAO/models/products-model.js";

class ProductApiService {
  async getProducts(limit, page, query, sort) {

    const filter = query ? { title: { $regex: query, $options: 'i' } } : {};
    const sortOption = sort == "asc" ? { price: 1 } : { price: -1 };
    
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: sortOption
    };

    const products = await ProductModel.paginate(filter, options);
    return products;
  }

  async getAllProducts() {
    const products = await ProductModel.find({});
    return products;
  }

  async getOneProduct(_id) {
    const product = await ProductModel.findOne({ _id: _id })
    return product;
  }

  async addProduct(newInfo) {
    //this.valitationProduct(newInfo)
    const newProduct = await ProductModel.create(newInfo);
    return newProduct;
  }

  async updateProduct(_id, dataToUpdate) {
    //this.valitationProduct(newInfo)
    const productUpdated = await ProductModel.updateOne({_id: _id}, dataToUpdate);
    return productUpdated; 
  }

  async deleteProduct(_id) {
    const deleted = await ProductModel.deleteOne({ _id: _id });
    return deleted
  }
}

export const productApiService = new ProductApiService();
