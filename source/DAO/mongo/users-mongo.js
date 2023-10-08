import UserModel from "./models/users-model.js";

class UserMongoDAO {
  async findAll() {
    return await UserModel.find();
  }

  async findSome(filter, options) {
    return await UserModel.paginate(filter, options);
  }

  async findById(id) {
    return await UserModel.findById({ _id: id });
  }

  async findOne(query) {
    return await UserModel.findOne(query);
  }

  async create(user) {
    return await UserModel.create(user);
  }

  async createMany(user) {
    return await UserModel.insertMany(user);
  }

  async update(id, user) {
    return await UserModel.findOneAndUpdate({ _id: id }, user, {
      new: true,
    });
  }

  async delete(code) {
    return await UserModel.findOneAndDelete({ _id: code });
  }
}

export default new UserMongoDAO();
