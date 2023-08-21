//para crear datos en la base de datos con faker
import { fakerES } from "@faker-js/faker";
import { UsersModel } from "../dao/mongo/models/users-model.js";
import { ProductModel } from "../dao/mongo/models/products-model.js";

export const generateUsers = () => {};

export const generateProducts = () => {
  (async () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push({
        title: fakerES.commerce.productName(),
        description: fakerES.commerce.productDescription(),
        category: fakerES.commerce.department(),
        price: fakerES.commerce.price({ min: 100, max: 999, dec: 0 }),
        thumbnail: fakerES.image.url(),
        code: fakerES.string.sample(5),
        stock: fakerES.number.int({ min: 1, max: 100 }),
        status: fakerES.datatype.boolean(),
      });
    }
    try {
      await ProductModel.insertMany(products);
      console.log("Inserted ", products.length, " of products");
    } catch (error) {
      console.error("Error in the process of insert products: ", error);
    }
  })();
};
