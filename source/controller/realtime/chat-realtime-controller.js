//@ts-check
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../config/logger-config.js";
import UserDTO from "../../dto/user-dto.js";

export const chatRealtimeController = {
  index: async function (req, res, next) {
    try {
      let user = {};
      if (req.session && req.session.user) {
        user = new UserDTO(req.session.user);
      } else {
        user = {};
      }

      logger.info("cliente conectado al chat");

      return res.render("realtime-views/chat-live-realtime.handlebars", {
        title: "Chat Live",
        user: user,
        style: "realtime/chat.css",
      });
    } catch (error) {
      logger.error("Error showing the chat messages: " + error.message);

      return next(
        CustomError.createError({
          name: "ChatMessagesError",
          cause: error,
          message: "Error showing the chat messages",
          code: EErrors.DATABASE_ERROR,
        })
      );
    }
  },
};
