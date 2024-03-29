//@ts-check
import mongoose from "mongoose";
import { logger } from "./logger-config.js";
import { entorno } from "./env-config.js";
const { mongoUrl } = entorno;

export default class SingletonMongo {
  static #mongoInstance;

  static async connectToMongo() {
    try {
      await mongoose.connect(String(mongoUrl));
      logger.info("Plug to mongo!");

      return;
    } catch (error) {
      logger.info(error);
      throw "Can not connect to the database";
    }
  }

  static async getInstance() {
    if (this.#mongoInstance) {
      return this.#mongoInstance;
    }
    this.#mongoInstance = new SingletonMongo();
    await this.connectToMongo();
    return this.#mongoInstance;
  }

  static hasInstance() {
    return !!this.#mongoInstance;
  }
} 
