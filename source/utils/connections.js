//@ts-check
import { connect } from "mongoose";


import faker from "faker";
import { ProductModel } from "../DAO/models/products-model.js";

export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://alejandrosanz:9TJnFW2eCrWdNaxK@ecommerce.anbm0y3.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("plug to mongo!");
    
    
    
    /* //para crear base de datos de productos falsos con faker
    (async () => {
      const products = [];
      for (let i = 0; i < 100; i++) {
        products.push({
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
          price: faker.commerce.price(),
          thumbnail: faker.image.imageUrl(),
          code: faker.random.alphaNumeric(8),
          stock: faker.random.number({ min: 0, max: 100 }),
          status: faker.random.boolean(),
        });
      }
      try {
        await ProductModel.insertMany(products);
        console.log("Inserted", products.length, "products");
      } catch (error) {
        console.error("Error en insert many:", error);
      }
    })(); */
    
  } catch (e) {
    console.log(e);
    throw "can not connect to the database";
  }
}
