//@ts-check
import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
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
});

cartSchema.plugin(mongoosePaginate);

const CartModel = model("carts" /* nombre de la coleccion */, cartSchema);
export default CartModel;
