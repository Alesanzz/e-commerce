//@ts-check
import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
	code: { type: String, required: true, unique: true, default: () => Math.random().toString(36).toUpperCase(), },
	purchase_datetime: { type: Date, required: true, default: Date.now, },
	purchaser: { type: String, required: true },
	cartId: { type: String, required: true },
	products: [
		{
			product: { type: Schema.Types.ObjectId, ref: 'products' },
			quantity: { type: Number, required: true },
		},
	],
	amount: { type: Number, required: true },
});

const TicketModel = model('ticket' /* nombre de la coleccion */, ticketSchema);
export default TicketModel;
