import express from "express";
import { ticketsController } from "../../controller/tickets/tickets-controller.js";

export const routerTickets = express.Router();

//ver un solo tickets de compra
routerTickets.get("/:id_ticket", ticketsController.showOneTicket)
//crear un tickets de compras
routerTickets.post("/:id_cart/purchase", ticketsController.createTicket)
