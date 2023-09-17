import express from "express";
import { ticketsController } from "../../controller/tickets/tickets-controller.js";

export const routerTickets = express.Router();

//ver un solo tickets de compra
routerTickets.get("/:id_ticket", ticketsController.showOneTicket)

