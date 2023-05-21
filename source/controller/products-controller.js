//importando las funciones de la clase product manager
import { productManager } from "../modules/products-manager.js";
const products = productManager.getProducts();

export const productController = {
    index: function(req, res) {
        let products = productManager.getProducts();
        return res.render("products-list", { products });
    },
}
