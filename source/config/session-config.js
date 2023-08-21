import SingletonMongo from './connections.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { entorno } from "./env-config.js";

//para guardar las session en la base de datos en mongodb, de forma que si se apaga el servidor, las session siguen existiendo - (el ttl: es el tiempo de duracion de la session)
export const sessionConfig = () => {
	console.log('SingletonMongo has instance:', SingletonMongo.hasInstance());
	if (SingletonMongo.hasInstance()) {
		return session({
			store: MongoStore.create({
                mongoUrl: entorno.mongoUrl,
                ttl: 86400 * 3,
              }),
              secret: "un-re-secreto",
              resave: true,
              saveUninitialized: true,
		});
	} else {
		return (req, res, next) => next();
	}
};
