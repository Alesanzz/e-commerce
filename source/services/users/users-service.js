//@ts-check
//importando las funciones de la clase product manager
import { UserModel } from "../../DAO/models/users-model.js";

class UserService {
  async createNewUser(infoOfBody) {
    const newUser = await UserModel.create({
      name: infoOfBody.name,
      surname: infoOfBody.surname,
      age: infoOfBody.age,
      country: infoOfBody.country,
      email: infoOfBody.email,
      password: infoOfBody.password,
    });

    return newUser;
  }

  async findAUser(email) {
    const userCheck = await UserModel.findOne({ email: email });
    
    return userCheck;
  }
 
}

export const userService = new UserService();
