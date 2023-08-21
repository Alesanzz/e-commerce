//@ts-check
import UserDTO from "../../dto/user-dto.js";

export const chatRealtimeController = {
  index: async function (req, res) {
    try {
      let user = {}
    if (req.session && req.session.user) {
      user = new UserDTO(req.session.user)
    }else{
      user = {}
    }

      console.log("cliente conectado al chat");

      return res.render("realtime-views/chat-live-realtime.handlebars", {
        title: "Chat Live", 
        user: user,
        style: "realtime/chat.css" 
      });
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        msg: "Something went wrong",
        data: { error },
      });
    }
  },
};
