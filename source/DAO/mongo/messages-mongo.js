import MessageModel from './models/messages-model.js';

class MessageMongoDAO {
	async findAll() {
		return await MessageModel.find();
	}

	async create(newMessage) {
		return await MessageModel.create(newMessage);
	}
}

export default new MessageMongoDAO();
