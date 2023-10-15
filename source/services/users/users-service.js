//@ts-check
import crypto from "crypto";
import { DAOFactory } from "../../dao/factory.js";
import {
  createHashPassword,
  checkPassword,
} from "../../config/bcrypt-config.js";

const userDAO = await DAOFactory("users");

class UserService {
  async getUsers(limit, page, query, sort) {
    const filter = query ? { title: { $regex: query, $options: "i" } } : {};
    const sortOption = sort == "asc" ? { price: 1 } : { price: -1 };

    const options = {
      limit: limit || 5,
      page: page || 1,
      sort: sortOption,
    };

    const users = await userDAO.findSome(filter, options);
    return users;
  }

  async getAllUsers() {
    const users = await userDAO.findAll({});
    return users;
  }

  async findAUser(email) {
    const userCheck = await userDAO.findOne({ email: email });

    return userCheck;
  }

  async generateToken(email) {
    const user = await userDAO.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hora

    user.passwordToken = token;
    user.passwordTokenExpires = expires;

    await userDAO.update({ _id: user._id }, user);

    return token;
  }

  async validateResetToken(email, token) {
    const user = await userDAO.findOne({
      email,
      passwordToken: token,
      passwordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }
    return true;
  }

  async updatePassword(email, newPassword) {
    const user = await userDAO.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = createHashPassword(newPassword);
    await userDAO.update(
      { _id: user._id },
      {
        password: hashedPassword,
        passwordToken: null,
        passwordTokenExpires: null,
      }
    );
  }

  async changeRoll(id) {
    const user = await userDAO.findById( id );
    if (user.admin == false) {
      await userDAO.update({ _id: user._id }, { admin: true });
    } else if (user.admin == true) {
      await userDAO.update({ _id: user._id }, { admin: false });
    } else {
      throw new Error("User not found");
    }
  }

  async deleteUser(_id) {
    const deleted = await userDAO.delete(_id);
    return deleted;
  }
}

export const userService = new UserService();
