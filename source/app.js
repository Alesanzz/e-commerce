//requiriendo y configurando express
import express from "express";
const server = express();
const port = 8080;

//session y cookies
import cookieParser from "cookie-parser";
import session from "express-session";

//requiriendo y definiendo a mongoDB como base de datos del proyecto
import { connectMongo } from "./utils/connections.js";
import MongoStore from "connect-mongo";
connectMongo();
//para guardar las session en la base de datos en mongodb, de forma que si se apaga el servidor, las session siguen existiendo - (el ttl: es el tiempo de duracion de la session)
server.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://alejandrosanz:9TJnFW2eCrWdNaxK@ecommerce.anbm0y3.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 86400 * 2,
    }),
    secret: "un-re-secreto",
    resave: true,
    saveUninitialized: true,
  })
);

//importando dirname
import { sourceDirname } from "./utils/dirname.js";

//configurando el uso de passport
import passport from "passport";
import { iniPassport } from "./config/passport-config.js";

iniPassport();
server.use(passport.initialize());
server.use(passport.session());

//para configurar archivos como publicos
server.use(express.static("public"));

//para configurar el motor de handlebars (las 4 lineas)
import handlebars from "express-handlebars";
server.engine("handlebars", handlebars.engine());
server.set("views", sourceDirname + "/views");
server.set("view engine", "handlebars");

//la siguiente linea es para poder usar mejor el req.query, extendiendo las opciones
server.use(express.urlencoded({ extended: true }));
//para configurar de que el servidor siempre responda devolviendo archivos en formato json
server.use(express.json());

//--------------------------------------------------------------------------------------------------
//importando las rutas de las apis
import { routerApiProducts } from "./routes/apis/products-routes.js";
import { routerApiCarts } from "./routes/apis/carts-routes.js";
import { routerApiSessions } from "./routes/apis/sessions-routes.js";

//endpoint tipo api (crudos en json)
server.use("/api/products", routerApiProducts);
server.use("/api/carts", routerApiCarts);
server.use("/api/sessions", routerApiSessions);

//importando las rutas de los views
import { routerProducts } from "./routes/products/products-routes.js";
import { routerCarts } from "./routes/carts/carts-routes.js";
import { routerUsers } from "./routes/users/users-routes.js";

//endpoint de views
server.use("/products", routerProducts);
server.use("/carts", routerCarts);
server.use("/users", routerUsers);

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
import { connectSocket } from "./utils/socket-server.js";
const httpServer = server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
connectSocket(httpServer);
