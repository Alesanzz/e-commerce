//importando las funciones de la clase product manager
import { productManager } from "../modules/products-manager.js";
const products = productManager.getProducts();

export const productRealtimeController = {
    index: function(req, res) {
        console.log("cliente conectado")
        let products = productManager.getProducts();
        return res.render("real-time-products", { products });
    },
}
