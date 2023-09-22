//@ts-check
//importando las funciones de la carpeta services
import CustomError from '../../services/errors/custom-error.js';
import EErrors from '../../services/errors/enums.js';
import { logger } from '../../config/logger-config.js';
import { mockingService } from "../../services/mocking/mocking-service.js";

export const mockingController = {
  createProductsMocks: async function (req, res, next) {
    try {
      const newProducts = await mockingService.generateProducts()
      return res.status(201).redirect("/products");

    } catch (error) {
        logger.error('Error retrieving all products: ' + error.message)

        return next(
				CustomError.createError({
					name: 'CreateMockProductsError',
					cause: error,
					message: 'Error creating mock products',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
  },

  createUsersMocks: async function (req, res, next) {
    try {
      const newUsers = await mockingService.generateUsers()
      return res.status(201).redirect("/users/login");

    } catch (error) {
      logger.error('Error retrieving all users: ' + error.message)

      return next(
      CustomError.createError({
        name: 'CreateMockUsersError',
        cause: error,
        message: 'Error creating mock users',
        code: EErrors.DATABASE_ERROR,
      }),
    );
  }
  },
};
