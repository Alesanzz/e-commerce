//@ts-check
import { Schema, model } from "mongoose";
import mongoosePaginate  from 'mongoose-paginate-v2';

const userSchema = new Schema({
  first_name: { type: String, required: true, minlength: 2, maxlength: 30, index: true },
  last_name: { type: String, required: true, minlength: 2, maxlength: 30, index: true },
  age: { type: Number, required: true, min: 1 },
  country: { type: String, required: true, minlength: 2, maxlength: 40 },
  email: { type: String, required: true, unique: true, minlength: 3, maxlength: 40, index: true },
  password: { type: String, required: true},
  admin: { type: Boolean, required: false, default: false },
  cart: { type: String, required: false },
}); 

userSchema.plugin(mongoosePaginate);

export const UserModel = model("users" /* nombre de la coleccion */, userSchema);

/* La propiedad "index: true" es para crear un indice de ese esa propiedad y asi la base de datos lo pueda buscar mas rapido */