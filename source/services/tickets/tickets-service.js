//@ts-check
import { DAOFactory } from '../../dao/factory.js';

const ticketDAO = await DAOFactory('tickets');

class TicketService {
	async createTicket(ticketData) {
		try {
			return await ticketDAO.create(ticketData);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

export const ticketService = new TicketService();
