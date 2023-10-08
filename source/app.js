import { logger } from "./config/logger-config.js";

//configurando el entorno
import { entorno } from "./config/env-config.js";
//logger.info(entorno);

//requiriendo y configurando express
import express from "express";
const server = express();
const port = entorno.port;

//requiriendo y definiendo el uso de session con mongodb, de forma que si se apaga el servidor, las session siguen existiendo - (el ttl: es el tiempo de duracion de la session)
import { sessionConfig } from "./config/session-config.js";
server.use(sessionConfig());

//importando dirname
import { sourceDirname } from "./config/dirname-config.js";

//para configurar archivos como publicos
server.use(express.static("public"));

//para configurar method-override para manejar solicitudes DELETE
import methodOverride from "method-override";
server.use(methodOverride("_method"));

//para configurar el motor de handlebars (las 4 lineas)
import handlebars from "express-handlebars";
server.engine("handlebars", handlebars.engine());
server.set("views", sourceDirname + "/views");
server.set("view engine", "handlebars");

//la siguiente linea es para poder usar mejor el req.query, extendiendo las opciones
server.use(express.urlencoded({ extended: true }));
//para configurar de que el servidor siempre responda devolviendo archivos en formato json
server.use(express.json());

//configurando el uso de passport
import passport from "passport";
import { iniPassport } from "./services/users/users-service-passaport.js";

iniPassport();
server.use(passport.initialize());
server.use(passport.session());

//configurando la documentacion del proyecto con swagger
import { specs } from "./config/swagger-config.js";
import swaggerUiExpress from "swagger-ui-express";
server.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


//--------------------------------------------------------------------------------------------------
//importando las rutas de las apis
import { routerApiProducts } from "./routes/apis/products-routes.js";
import { routerApiCarts } from "./routes/apis/carts-routes.js";
import { routerApiUsers } from "./routes/apis/users-routes.js";
import { routerApiSessions } from "./routes/apis/sessions-routes.js";
import { routerErrors } from "./routes/errors/errors-routes.js";

//endpoint tipo api (crudos en json)
server.use("/api/products", routerApiProducts);
server.use("/api/carts", routerApiCarts);
server.use("/api/users", routerApiUsers);
server.use("/api/sessions", routerApiSessions);
server.use("/loggertest", routerErrors);

//importando las rutas de los views
import { routerProducts } from "./routes/products/products-routes.js";
import { routerCarts } from "./routes/carts/carts-routes.js";
import { routerUsers } from "./routes/users/users-routes.js";
import { routerTickets } from "./routes/tickets/tickets-routes.js";
import { routerMocking } from "./routes/mocking/mocking-routes.js";

//endpoint de views
server.use("/products", routerProducts);
server.use("/carts", routerCarts);
server.use("/users", routerUsers);
server.use("/tickets", routerTickets);
server.use("/mocking", routerMocking);

//importando las rutas de los views en realtime (servidor socket.io)
import { routerRealTimeProducts } from "./routes/realtimes/products-realtime-routes.js";
import { routerViewChat } from "./routes/realtimes/chat-view-router.js";

//endpoint de views en real time (servidor socket.io)
server.use("/realtimeproducts", routerRealTimeProducts);
server.use("/chatsocket", routerViewChat);

//cuando la ruta no existe
server.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "Error", msg: "La ruta no existe", data: {} });
});
//--------------------------------------------------------------------------------------------------

//para confirgurar el servidor socket hay que importar el archivo donde se encuentra toda la logica del socket server, luego guardar el servidor http en una variable y por ultimo ejecurtar el "servidor" de socket.io sobre nuestro servidor http
import { connectSocket } from "./config/socket-server-config.js";
const httpServer = server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
connectSocket(httpServer);

//middleware para controlar y manejar mejor los errores del servidor
import errorHandler from "./middlewares/error-middleware.js";
server.use(errorHandler);
