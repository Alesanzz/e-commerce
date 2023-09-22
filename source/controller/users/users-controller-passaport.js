//@ts-check
import { entorno } from "../../config/env-config.js";
import nodemailer from "nodemailer";
import { userService } from "../../services/users/users-service.js"
import { logger } from "../../config/logger-config.js";
import CustomError from "../../services/errors/custom-error.js";
import EErrors from "../../services/errors/enums.js";
import UserDTO from "../../dto/user-dto.js";

export const userController = {
  showProfile: async function (req, res, next) {
    let user = {}
    if (req.session && req.session.user) {
      user = new UserDTO(req.session.user)
    }else{
      user = {}
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
					name: 'RenderProfileError',
					cause: error,
					message: 'Error rendering the profile',
					code: EErrors.USER_NOT_FOUND,
				}),
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

      return res.status(200).redirect("/users/profile");
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

  forgotPassword: async function (req, res, next) {
    try {
      if (req.session && req.session.user) {
				return res.status(200).redirect('/users/profile');
			}
			return res.status(200).render("users-views/forgot-password", {
        title: "Reestablecer contraseña",
      });

    } catch (error) {
      logger.error("Error rendering forgot-password view: " + error.message);

			return next(
				CustomError.createError({
					name: 'RenderForgotPasswordError',
					cause: error,
					message: 'Error rendering forgot password view',
					code: EErrors.UNAUTHORIZED_ACTION,
				}),
			);
		}
  },

  requestResetPassword: async function (req, res, next) {
    try {
			const email = req.body.email;
			logger.debug(`Email: ${email}`);

			const token = await userService.generateToken(email);
			logger.debug(`Token: ${token}`);

      //EESSSSSSSSSSTOOOOOOOOOOOOO HAY QUE ARREGLARLO... POR LO QUE RECUERDO DEBERIA VER LA GRABACION, PORQUE HAY QUE CONFIGURAR ALGO EN EL MAIL PERSONAL PARA QUE SE PERMITA ESTO DE ENVIAR MAILS

      //------------------------ AAAAAAAAAAAAAAAAAAAAAA-----------
 
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				port: 587,
				auth: {
					user: entorno.googleEmail,
					pass: entorno.googlePassword,
				},
			});

			const mailOptions = {
				from: entorno.googleEmail,
				to: email,
				subject: 'Password Reset',
				html: `<html>
				<head>
					<title>Reset Password</title>
				</head>
				<body>
					<h1>Hello,</h1>
					<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
					<p>Please click on the following link, or paste it into your browser to complete the process:</p>
					<a href="http://localhost:${entorno.port}/api/users/reset-password?token=${token}&email=${email}">Reset Password</a>
					<p>This link will expire in one hour.</p>
					<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
				</body>
				</html>`,
			};

			await transporter.sendMail(mailOptions);
			logger.debug('Mail sent successfully');

			res.status(200).send({message: 'Password reset link sent.'});
		} catch (error) {
			logger.debug('Error in requestPasswordReset: ', error);

			next(error);
		}
	},

  resetPassword: async function (req, res, next) {
    logger.debug('Entered renderResetPassword with query:', req.query);

		const {token, email} = req.query;
		try {
			// Validate the token and email
			await userService.validateResetToken(email, token);
			// Render the reset password page
			res.render('reset-password', {token, email});
		} catch (error) {
			if (error.message === 'Invalid or expired reset token') {
				// Redirect to a view where the user can request a new reset email
				return res.redirect('/api/users/forgot-password');
			}
			next(error);
		}
	},

  resetPasswordSave: async function (req, res, next) {
		logger.debug('Received body in resetPassword: ', req.body);

		try {
			const {email, token, newPassword} = req.body;

			await userService.validateResetToken(email, token);
			await userService.updatePassword(email, newPassword);

			res.status(200).json({message: 'Password updated successfully.'});
		} catch (error) {
			logger.error('Error in resetPassword: ', error);

			res.status(500).json({
				status: 'error',
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
