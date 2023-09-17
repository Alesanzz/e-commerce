//@ts-check
//importando las funciones de la carpeta services
import UserDTO from "../../dto/user-dto.js";
import { cartService } from "../../services/carts/carts-service.js";

export const ticketsController = {
  showOneTicket: async function (req, res) {
    let user = {};
    if (req.session && req.session.user) {
      user = new UserDTO(req.session.user);
    } else {
      user = {};
    }

    try {
      const id = req.params.id_cart;
      const cart = await cartService.getOneCart(id);
      const theCart = cart.products.map((prod) => prod.toJSON());

      return res.status(200).render("carts-views/carts-list", {
        title: "Detalle del carro",
        user: user,
        cart: theCart,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrongggg",
        data: { error },
      });
    }
  },
};
