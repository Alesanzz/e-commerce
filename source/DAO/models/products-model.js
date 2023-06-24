//@ts-check
import { Schema, model } from "mongoose";

export const ProductModel = model(
  "products" /* nombre de la coleccion donde se va hacer el crud */,
  
  new Schema({
    title: { type: String, required: true, minlength: 2, maxlength: 100 },
    description: { type: String, required: true, minlength: 2, maxlength: 500 },
    category: { type: String, required: true, minlength: 2, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, required: true, minlength: 2, maxlength: 200 },
    code: { type: String, required: true, unique: true, minlength: 2, maxlength: 10 },
    stock: { type: Number, required: true, min: 0 },
    status: { type: Boolean, required: false, default: true },
  })
);
