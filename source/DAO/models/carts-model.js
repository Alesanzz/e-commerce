//@ts-check
import { Schema, model } from "mongoose";

export const CartModel = model(
  "carts" /* nombre de la coleccion donde se va hacer el crud */,

  new Schema({
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "products",
          },
          quantity: { type: Number, default: 1 },
        },
      ],
      required: true,
    },
  })
);
