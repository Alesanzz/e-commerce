//requiriendo y configurando express
import express from "express";
const server = express();
const port = 8080;

//requiriendo el npm de socket para poder usar este tipo de servidores
import { Server } from "socket.io";

//para configurar archivos como publicos
server.use(express.static("public"));

//importando dirname
import { sourceDirname } from "./middlewares/dirname.js";

//para configurar el motor de handlebars (las 4 lineas)
import handlebars from "express-handlebars";
server.engine("handlebars", handlebars.engine());
server.set("views", sourceDirname + "/views");
server.set("view engine", "handlebars");

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
import { routerProducts } from "./routes/products/products-v-routes.js";

//endpoint de views
server.use("/products", routerProducts);

//importando las rutas de los views en realtime (servidor socket.io)
import { routerRealTimeProducts } from "./routes/realtimes/products-realtime-routes.js";

//endpoint de views en real time (servidor socket.io)
server.use("/realtimeproducts", routerRealTimeProducts);

//cuando la ruta no existe
server.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "Error", msg: "La ruta no existe", data: {} });
});

//para confirgurar el servidor socket hay que guardar el servidor http en una variable y luego ejecurtar el "Server" de socket.io sobre nuestro servidor http
const httpServer = server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const socketServer = new Server(httpServer);

import { productManager } from "./modules/products-manager.js";

//socket.on = es para configurar que se debe estar pendiente de escuchar cuando envien el primer parametro del front
//primer parametro = nombre del parametro a escuchar
//segundo parametro = un objeto que se recibe del front

//socketServer.emit = es para realizar un envio de informacion del back al front a todos los canales/usuarios con el front (recordemos que existe un canal socket de front por cada chat/usuario que acceda a nuestra pagina)
//primer parametro = nombre del parametro a enviar
//segundo parametro = un objeto que se manda al front

socketServer.on("connection", (socket) => {
  socket.on("new-product-created", async (newProduct) => {
    try {
      await productManager.addProduct(newProduct);
      
      let allProducts = await productManager.getProducts();
      socketServer.emit("all-the-products", allProducts);
    } catch (error) {
      console.log(error);
    }
  });
  
  socket.on("delete-product", async (iidd) => {
    try {
      await productManager.deleteProduct(iidd);
  
      let allProducts = await productManager.getProducts();
      socketServer.emit("all-the-products", allProducts);
    } catch (error) {
      console.log(error);
    }
  });
}); 
