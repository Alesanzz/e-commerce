//@ts-check
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../config/logger.config.js";

export const userController = {
  register: async function (req, res, next) {
    try {
      return res.status(200).render("users-views/register-user", {
        title: "Registro de usuarios",
        style: "users/register.css",
      });
    } catch (error) {
      logger.error("Error rendering register form: " + error.message);

			return next(
				CustomError.createError({
					name: 'RenderRegisterError',
					cause: error,
					message: 'Error rendering register form',
					code: EErrors.UNAUTHORIZED_ACTION,
				}),
			);
		}
  },

  save: async function (req, res, next) {
    try {
      return res.status(200).redirect("/users/login");
    } catch (error) {
      logger.error("Error during saving the new user: " + error.message);

			return next(
				CustomError.createError({
					name: 'RegistrationSaveError',
					cause: error,
					message: 'Error during saving the new user',
					code: EErrors.USER_VALIDATION_ERROR,
				}),
			);
		}
  },

  login: async function (req, res, next) {
    try {
      return res.status(200).render("users-views/login-user", {
        title: "Ingreso al usuarios",
        style: "users/login.css",
      });
    } catch (error) {
      logger.error("Error rendering login form: " + error.message);

			return next(
				CustomError.createError({
					name: 'RenderLoginError',
					cause: error,
					message: 'Error rendering login form',
					code: EErrors.UNAUTHORIZED_ACTION,
				}),
			);
		}
  },

  access: async function (req, res, next) {
    try {
      const infoOfBody = req.body;
      if (!infoOfBody.email || !infoOfBody.password) {
        return res.status(400).render("users-views/error-page", {
          status: "error",
          msg: "faltan completar datos",
          data: { },
        });
      }
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        country: req.user.country,
        email: req.user.email,
        admin: req.user.admin,
        cart: req.user.cart,
      };

      return res.status(200).redirect("/products");
    } catch (error) {
      logger.error("Error logging the user: " + error.message);

			return next(
				CustomError.createError({
					name: 'LoginError',
					cause: error,
					message: 'Error logging the user',
					code: EErrors.AUTHENTICATION_ERROR,
				}),
			);
		}
  },

  githubLogin: async function (req, res, next) {
    if (!req.user) {
      return res.status(400).render("users-views/error-page", {
        status: "error",
        msg: "faltan completar datos",
        data: { },
      });
    }
    console.log(req.user);
    try {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        admin: req.user.admin,
        cart: req.user.cart,
      };

      return res.status(200).redirect("/products");
    } catch (error) {
      logger.error("Error during GitHub authentication: " + error.message);

			return next(
				CustomError.createError({
					name: 'GitHubAuthenticationError',
					cause: error,
					message: 'Error during GitHub authentication',
					code: EErrors.AUTHENTICATION_ERROR,
				}),
			);
		}
  },

  logout: async function (req, res, next) {
    req.session.destroy((error) => {
      if (error) {
        return res.render("users-views/error-page", {
          msg: "No se pudo cerrar la session",
        });
      }
      return res.redirect("/users/login");
    });
  },

  error: async function (req, res, next) {
    try {
      return res.status(200).render("users-views/error-page", {
        title: "Error in the user module",
        msg: "The is an error",
      });
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        msg: "Error in the register process",
        data: { error },
      });
    }
  },
};
