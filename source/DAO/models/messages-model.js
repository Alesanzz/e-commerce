//@ts-check
import { Schema, model } from "mongoose";

export const MenssageModel = model(
  "menssages" /* nombre de la coleccion donde se va hacer el crud */,

  new Schema({
    user: { type: String, required: true, max: 100, index: true },
    message: { type: String, required: true, max: 1000 },
  })
);

/* La propiedad "index: true" es para crear un indice de ese esa propiedad y asi la base de datos lo pueda buscar mas rapido */