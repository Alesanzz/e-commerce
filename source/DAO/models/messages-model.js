//@ts-check
import { Schema, model } from "mongoose";

export const MenssageModel = model(
  "menssages" /* nombre de la coleccion donde se va hacer el crud */,

  new Schema({
    user: { type: String, required: true, max: 100 },
    message: { type: String, required: true, max: 1000 },
  })
);
