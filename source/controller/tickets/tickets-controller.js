//@ts-check
//importando las funciones de la carpeta services
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../config/logger-config.js";
import { ticketService } from "../../services/tickets/tickets-service.js";

export const ticketsController = {
  showOneTicket: async function (req, res, next) {
    try {
      const id = req.params.id_ticket;
      const ticket = await ticketService.getOneTickect(id);

      return res.status(200).json({
        status: "Success",
        msg: "Ticket encontrado con exito",
        data: ticket,
      });
    } catch (error) {
      logger.error("Error retrieving ticket by ID: " + error.message);

      return next(
        CustomError.createError({
          name: "GetTicketByIdError",
          cause: error,
          message: "Error retrieving ticket by ID",
          code: EErrors.TICKET_NOT_FOUND,
        })
      );
    }
  },
};
