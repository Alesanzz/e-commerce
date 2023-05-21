//requiriendo y configurando express
import express from "express";
const server = express();
const port = 8080;

//importando dirname
import { sourceDirname } from "./middlewares/dirname.js";

//para configurar el motor de handlebars (las 4 lineas)
import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("views", sourceDirname + "/views");
app.set("view engine", "handlebars");

//para configurar archivos como publicos
app.use(express.static("public"));

//la siguiente linea es para poder usar mejor el req.query, extendiendo las opciones
server.use(express.urlencoded({ extended: true }));
//para configurar de que el servidor siempre responda devolviendo archivos en formato json
server.use(express.json());

//importando las rutas de las apis
import { routerApiHome } from "./routes/apis/home-routes.js";
import { routerApiProducts } from "./routes/apis/products-routes.js";
import { routerApiCarts } from "./routes/apis/carts-routes.js";

//endpoint tipo api (crudos en json)
server.use("/api", routerApiHome);
server.use("/api/products", routerApiProducts);
server.use("/api/carts", routerApiCarts);

//importando las rutas de los views


//endpoint de views


//importando las rutas de los views en real time (socket.io)


//endpoint de views en real time (socket.io)


//cuando la ruta no existe
server.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "Error", msg: "La ruta no existe", data: {} });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
