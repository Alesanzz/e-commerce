//@ts-check
import mongoose from 'mongoose';
import { entorno } from "./env-config.js";

export async function connectMongo(connectionUrl) {
  try {
    connectionUrl = entorno.mongoUrl;
    await mongoose.connect(connectionUrl);
    console.log("Plug to mongo!");

  } catch (e) {
    console.log(e);
    throw "can not connect to the database";
  }
}
