import SingletonMongo from '../config/connections.js';
import { entorno } from "../config/env-config.js";


//las lineas de abajo ahy que borrarla
export let isMongoConnected = false;

export const DAOFactory = async entity => {
  let DAO;
  
	switch (entorno.persistence) {
		case 'MONGODB':
			await SingletonMongo.getInstance();

			DAO = await import(`./mongo/${entity}-mongo.js`);
			break;

		case 'MEMORY':
			DAO = await import(`./memory/${entity}-memory.js`);
			break;

		case 'FS':
			DAO = await import(`./fs/${entity}-fs.js`);
			break;

		default:
			throw new Error('Persistence method not supported');
	}
	return DAO.default;
};