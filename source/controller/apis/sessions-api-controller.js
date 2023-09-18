//@ts-check
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../config/logger.config.js";
import UserDTO from "../../dto/user-dto.js";

export const sessionsApiController = {
  show: async function (req, res, next) {
    try {
      let user = req.session.user;

      if (!user) {
        return res.status(401).json({
          status: "Error",
          msg: "No hay usuario loggeado",
          data: {},
        });
      } else {
        return res.status(200).json({
          status: "Success",
          msg: "Mostrando los datos de la session",
          data: new UserDTO(user),
        });
      }
    } catch (error) {
      logger.error("Error retrieving session data: " + error.message);

      return next(
        CustomError.createError({
          name: "SessionDataError",
          cause: error,
          message: "Error retrieving session data",
          code: EErrors.AUTHENTICATION_ERROR,
        })
      );
    }
  },
};
