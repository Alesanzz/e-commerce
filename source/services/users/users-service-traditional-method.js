//@ts-check
import { DAOFactory } from '../../dao/factory.js';
import {createHashPassword, checkPassword} from "../../config/bcrypt-config.js"

const userDAO = await DAOFactory('user');

class UserService {
  async createNewUser(infoOfBody) {
    const newUser = await userDAO.create({
      first_name: infoOfBody.first_name,
      last_name: infoOfBody.last_name,
      age: infoOfBody.age,
      country: infoOfBody.country,
      email: infoOfBody.email,
      password: createHashPassword(infoOfBody.password),
    });

    return newUser;
  }

  async findAUser(email) {
    const userCheck = await userDAO.findOne({ email: email });
    
    return userCheck;
  }
 
}

export const userService = new UserService();
