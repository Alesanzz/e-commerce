//@ts-check
import { DAOFactory } from '../../dao/factory.js';

const productDAO = await DAOFactory('products');

class ProductService {
  async getProducts(limit, page, query, sort) {
    const filter = query ? { title: { $regex: query, $options: 'i' } } : {};
    const sortOption = sort == "asc" ? { price: 1 } : { price: -1 };
    
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: sortOption
    };

    const products = await productDAO.findSome(filter, options);
    return products;
  }

  async getAllProducts() {
    const products = await productDAO.findAll({});
    return products;
  }

  async getOneProduct(_id) {
    const product = await productDAO.findOne(_id)
    return product;
  }

  async addProduct(newInfo) {
    //this.valitationProduct(newInfo)
    const newProduct = await productDAO.create(newInfo);
    return newProduct;
  }

  async updateProduct(_id, dataToUpdate) {
    //this.valitationProduct(newInfo)
    const productUpdated = await productDAO.updateOne(_id, dataToUpdate);
    return productUpdated; 
  }

  async deleteProduct(_id) {
    const deleted = await productDAO.deleteOne(_id);
    return deleted
  }
}

export const productService = new ProductService();
