//@ts-check
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../config/logger-config.js";
import { userService } from "../../services/users/users-service.js";
import UserDTO from "../../dto/user-dto.js";

export const usersApiController = {
  getAllUsers: async function (req, res, next) {
    try {
      let { limit, page, query, sort } = req.query;
      const users = await userService.getUsers(
        limit,
        page,
        query,
        sort
        );
      let viewUsers = users.docs.map( user => new UserDTO(user) )
      return res.status(200).json({
        status: "Success",
        msg: "Mostrando todos los usuarios encontrados con exito",
        data: viewUsers,
      });
    } catch (error) {
      logger.error("Error retrieving all users: " + error.message);

      return next(
        CustomError.createError({
          name: "GetAllUsersError",
          cause: error,
          message: "Error retrieving all users",
          code: EErrors.DATABASE_ERROR,
        })
      );
    }
  },

};
