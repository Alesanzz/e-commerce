//@ts-check
import UserDTO from "../../dto/user-dto.js";

export const sessionsApiController = {
  show: async function (req, res) {
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
          data: new UserDTO (user),
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        msg: "Something went wrong",
        data: { error },
      });
    }
  },
};
