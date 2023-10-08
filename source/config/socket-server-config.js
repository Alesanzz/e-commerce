import { Server } from "socket.io";
import { logger } from "./logger-config.js";
import { productService } from "../services/products/products-service.js";
import { messagesService } from "../services/messages/messages-service.js";

export function connectSocket(httpServer) {
  const socketServer = new Server(httpServer);

  //socket.on = es para configurar que se debe estar pendiente de escuchar cuando envien el primer parametro del front
  //primer parametro = nombre del parametro a escuchar
  //segundo parametro = un objeto que se recibe del front

  //socketServer.emit = es para realizar un envio de informacion del back al front a todos los canales/usuarios con el front (recordemos que existe un canal socket de front por cada chat/usuario que acceda a nuestra pagina)
  //primer parametro = nombre del parametro a enviar
  //segundo parametro = un objeto que se manda al front

  socketServer.on('connection', (socket) => {
    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await messagesService.createMessage(msg);
      const msgs = await messagesService.getAllMessages(); 
      socketServer.emit('msg_back_to_front', msgs);
    });
  });

  socketServer.on("connection", (socket) => {
    socket.on("new-product-created", async (newProduct) => {
      try {
        await productService.addProduct(newProduct);

        let allProducts = await productService.getAllProducts();
        socketServer.emit("all-the-products", allProducts);
      } catch (error) {
        logger.info(error);
      }
    });

    socket.on("delete-product", async (_id) => {
      try {
        await productService.deleteProduct(_id);

        let allProducts = await productService.getAllProducts();
        socketServer.emit("all-the-products", allProducts);
      } catch (error) {
        logger.info(error);
      }
    });
  });
}
