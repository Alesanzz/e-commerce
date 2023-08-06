//@ts-check
import UserDTO from "../../dto/user-dto.js";

export const sessionsApiController = {
  show: async function (req, res) {
    try {
      let user = new UserDTO(req.session.user)

      return res.json({
        status: "Success",
        msg: "Mostrando los datos de la session",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong",
        data: { error },
      });
    }
  },
};
