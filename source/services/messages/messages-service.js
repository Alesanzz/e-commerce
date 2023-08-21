//@ts-check
import { DAOFactory } from "../../DAO/factory.js";

const messageDAO = await DAOFactory("messages");

class MessageService {
  async getAllMessages() {
    const messages = await messageDAO.findAll();
    return messages
  }

  async createMessage(messageData) {
    const newMessage = await messageDAO.create(messageData);
    return newMessage
  }
}

export const messagesService = new MessageService();