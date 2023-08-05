//@ts-check
import { connect } from "mongoose";
import { entorno } from "./env-config.js";

import { fakerES } from "@faker-js/faker";
import { ProductModel } from "../DAO/models/products-model.js";

export async function connectMongo(connectionUrl) {
  try {
    connectionUrl = entorno.mongoUrl;
    await connect(connectionUrl);
    
    console.log("plug to mongo!");

    //para crear base de datos de productos falsos con faker
    /* (async () => {
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
