import express from 'express';
import { logger } from '../../config/logger-config.js';

export const routerErrors = express.Router();

routerErrors.get('/', async (req, res) => {
	try {
        logger.debug('This is a debug log');
		logger.http('This is an http log');
		logger.info('This is an info log');
		logger.warn('This is a warning log');
		logger.error('This is an error log');
		logger.fatal('This is a fatal log');
 
		return res.status(200).send("Revisa la consola del servidor");
	} catch (error) {
		logger.error(error);
		res.status(501).send({status: 'error', msg: "Error in the server", error: error});
	}
});
