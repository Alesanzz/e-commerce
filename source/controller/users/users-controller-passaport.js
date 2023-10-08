//@ts-check
import { entorno } from "../../config/env-config.js";
import nodemailer from "nodemailer";
import { userService } from "../../services/users/users-service.js";
import { logger } from "../../config/logger-config.js";
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import UserDTO from "../../dto/user-dto.js";

export const userController = {
  list: async function (req, res, next) {
    try {
      let { limit, page, query, sort } = req.query;
      const dataUsers = await userService.getUsers(
        limit,
        page,
        query,
        sort
      );
      let users = dataUsers.docs.map( user => new UserDTO(user) )

      return res.status(200).render("users-views/list", {
        title: "Listado de usuarios",
        user: users,
        pagingCounter: dataUsers.pagingCounter,
        page: dataUsers.page,
        totalPages: dataUsers.totalPages,
        hasPrevPage: dataUsers.hasPrevPage,
        hasNextPage: dataUsers.hasNextPage,
        prevPage: dataUsers.prevPage,
        nextPage: dataUsers.nextPage,
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

  showProfile: async function (req, res, next) {
    let user = {};
    if (req.session && req.session.user) {
      user = new UserDTO(req.session.user);
    } else {
      user = {};
    }

    try {
      return res.status(200).render("users-views/profile", {
        user: user,
        title: "Registro de usuarios",
        style: "users/register.css",
      });
    } catch (error) {
      logger.error("Error rendering the profile: " + error.message);

      return next(
        CustomError.createError({
          name: "RenderProfileError",
          cause: error,
          message: "Error rendering the profile",
          code: EErrors.USER_NOT_FOUND,
        })
      );
    }
  },

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
          name: "RenderRegisterError",
          cause: error,
          message: "Error rendering register form",
          code: EErrors.UNAUTHORIZED_ACTION,
        })
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
          name: "RegistrationSaveError",
          cause: error,
          message: "Error during saving the new user",
          code: EErrors.USER_VALIDATION_ERROR,
        })
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
          name: "RenderLoginError",
          cause: error,
          message: "Error rendering login form",
          code: EErrors.UNAUTHORIZED_ACTION,
        })
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
          data: {},
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

      return res.status(200).redirect("/users/profile");
    } catch (error) {
      logger.error("Error logging the user: " + error.message);

      return next(
        CustomError.createError({
          name: "LoginError",
          cause: error,
          message: "Error logging the user",
          code: EErrors.AUTHENTICATION_ERROR,
        })
      );
    }
  },

  githubLogin: async function (req, res, next) {
    if (!req.user) {
      return res.status(400).render("users-views/error-page", {
        status: "error",
        msg: "faltan completar datos",
        data: {},
      });
    }

    try {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        admin: req.user.admin,
        cart: req.user.cart,
      };

      return res.status(200).redirect("/users/profile");
    } catch (error) {
      logger.error("Error during GitHub authentication: " + error.message);

      return next(
        CustomError.createError({
          name: "GitHubAuthenticationError",
          cause: error,
          message: "Error during GitHub authentication",
          code: EErrors.AUTHENTICATION_ERROR,
        })
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

  forgotPassword: async function (req, res, next) {
    try {
      return res.status(200).render("users-views/forgot-password", {
        title: "Reestablecer contraseña",
      });
    } catch (error) {
      logger.error("Error rendering forgot-password view: " + error.message);

      return next(
        CustomError.createError({
          name: "RenderForgotPasswordError",
          cause: error,
          message: "Error rendering forgot password view",
          code: EErrors.UNAUTHORIZED_ACTION,
        })
      );
    }
  },

  requestResetPassword: async function (req, res, next) {
    try {
      const email = req.body.email;
      logger.debug(`Email: ${email}`);

      const token = await userService.generateToken(email);
      logger.debug(`Token: ${token}`);

      //transportador
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
          user: entorno.googleEmail,
          pass: entorno.googlePassword,
        },
        //desactivar la validación del certificado (ojo esto NO es seguro para entornos de produccion)
        tls: {
          rejectUnauthorized: false,
        },
      });

      const message = {
        from: entorno.googleEmail,
        to: email,
        subject: "Cambio de contraseña",
        html: `<html>
				<head>
					<title>Cambio de contraseña</title>
				</head>
				<body>
					<h1>Estimado cliente,</h1>
					<p>Esperamos que estés teniendo una gran experiencia en nombre de la empresa, y es por eso que a veces es necesario restablecer tu contraseña para mantener tu cuenta segura. No te preocupes, estamos aquí para ayudarte!</p>

					<p>Para restablecer tu contraseña, simplemente sigue estos pasos sencillos:</p>

					<p>1. Haz clic <a href="http://localhost:${entorno.port}/users/reset-password?token=${token}&email=${email}">aqui</a> o copia el enlace de restablecimiento de contraseña y pégalo en tu navegador web.</p>
					

					<p>2. Te recordamos que el enlace tiene una vida de 1 hora, pero si lo sigues serás redirigido a una página segura donde podrás crear una nueva contraseña para tu cuenta.</p>
					<p>3. Asegúrate de que tu nueva contraseña sea segura y única, con al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas, números y caracteres especiales.</p>
					<p>4. Solo confirma tu nueva contraseña y listo, tu contraseña estará actualizada y podrás acceder a tu cuenta con seguridad..</p>

					<p>Si no solicitaste el restablecimiento de contraseña o tienes alguna pregunta, por favor contáctanos de inmediato. Estamos aquí para ayudarte en cualquier momento.</p>
					
					<p>Saludos.</p>
				</body>
				</html>`,
      };

      await transporter.sendMail(message);
      logger.debug("Mail sent successfully");

      res.status(200).render("users-views/password-chage-start");
    } catch (error) {
      logger.debug("Error in requestPasswordReset: ", error);

      next(error);
    }
  },

  resetPassword: async function (req, res, next) {
    logger.debug(req.query);
    const { email, token } = req.query;
    try {
      //primero se debe validar el token enviado, y determinar si es verdadero y se encuentra vigente
      await userService.validateResetToken(email, token);
      return res.render("users-views/reset-password", { token, email });
    } catch (error) {
      if (error.message === "Invalid or expired reset token") {
        //se vuelve a redireccionar a la pagina del login para que el usuario vuelva a empezar
        return res.redirect("/users/login");
      }
      next(error);
    }
  },

  resetPasswordSave: async function (req, res, next) {
    try {
      const { email, token, newPassword } = req.body;

      await userService.validateResetToken(email, token);
      await userService.updatePassword(email, newPassword);

      res.status(200).render("users-views/password-save");
    } catch (error) {
      logger.error("Error in resetPassword: ", error);

      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
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
