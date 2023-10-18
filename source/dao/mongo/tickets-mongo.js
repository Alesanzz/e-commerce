import TicketModel from "./models/tickets-model.js";

class TicketMongoDAO {
  async getAll() {
    return await TicketModel.find();
  }

  async findOne(code) {
    return await TicketModel.findOne({ _id: code });
  }

  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }

  async update(id, ticketData) {
    return await TicketModel.findByIdAndUpdate(id, ticketData, { new: true });
  }

  async delete(id) {
    return await TicketModel.findByIdAndDelete(id);
  }
}

export default new TicketMongoDAO();
