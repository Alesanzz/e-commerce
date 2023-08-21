import UserModel from "./models/users-model.js";

class UserMongoDAO {
  async findAll() {
    return await UserModel.find();
  }

  async findById(id) {
    return await UserModel.findById(id);
  }

  async findOne(query) {
    return await UserModel.findOne(query);
  }

  async create(user) {
    return await UserModel.create(user);
  }

  async update(id, user) {
    return await UserModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }
}

export default new UserMongoDAO();
