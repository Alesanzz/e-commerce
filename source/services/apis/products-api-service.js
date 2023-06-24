//@ts-check
//importando las funciones de la clase product manager
import { ProductModel } from "../../DAO/models/products-model.js";

class ProductApiService {
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
