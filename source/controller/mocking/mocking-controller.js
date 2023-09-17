//@ts-check
//importando las funciones de la carpeta services
import { mockingService } from "../../services/mocking/mocking-service.js";

export const mockingController = {
  createProductsMocks: async function (req, res) {
    try {
      const newProducts = await mockingService.generateProducts()
      return res.status(201).redirect("/products");

    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrongggg",
        data: { error },
      });
    }
  },

  createUsersMocks: async function (req, res) {
    try {
      const newUsers = await mockingService.generateUsers()
      return res.status(201).redirect("/users/login");

    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrongggg",
        data: { error },
      });
    }
  },
};
