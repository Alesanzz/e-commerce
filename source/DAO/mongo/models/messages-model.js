//@ts-check
import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const messageSchema = new Schema({
  user: { type: String, required: true, max: 100, index: true },
  msg: { type: String, required: true, max: 1000 },
});

messageSchema.plugin(mongoosePaginate);

const MessageModel = model("messages" /* nombre de la coleccion */,messageSchema);
export default MessageModel;

/* La propiedad "index: true" es para crear un indice de ese esa propiedad y asi la base de datos lo pueda buscar mas rapido */