import fs from "fs";
import path from "path";
import { __dirname } from "../middlewares/dirname.js";

class CartManager {
  constructor() {
    this.carts = [];
    this.filePath = path.resolve(__dirname, "../dataBase/carts.json");

    //comprobando si ya existe la base de datos o no existe
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, []);
    } else {
      //leyendo la base de datos
      let datos = fs.readFileSync(this.filePath, "utf-8");
      //para devolver el string a su formato original
      const cartsAObject = JSON.parse(datos);
      this.carts = cartsAObject;
    }
  }

  getCarts() {
    return this.carts;
  }

  getCartsById(id) {
    const encontrado = this.carts.find((elements) => elements.id == id);
    if (encontrado) {
      return encontrado;
    } else {
      throw new Error("The id: " + id + " was not found");
    }
  }

  #newId() {
    let maxId = this.carts.reduce(
      (accomulador, carts) => Math.max(accomulador, carts.idCart),
      0
    );
    let newId = maxId + 1;
    return newId;
  }

  addCart(dato) {
    let newCart = {
      idCart: this.#newId(),
      products: [],
    };

    this.carts = [...this.carts, newCart];

    //En la linea justo de abajo, se utiliza para convertir los datos en formato de string, y se coloca el segundo parametro (null) y el tercer paremetro (numero de tabulaciones que se desea), para que el archivo json en la base de datos se vea de forma mas ordenado, estos dos parametros son opcionales.
    const cartAString = JSON.stringify(this.carts, null, 2);
    fs.writeFileSync(this.filePath, cartAString);
  }

  addProductToCart(idCart, idProduct, quantity){


  }

  //   updateProduct(id, prod) {
  //     let productToUpdate = this.getProductsById(id);
  //     let notUpdated = this.products.filter(function (elemento) {
  //       return elemento.id != id;
  //     });

  //     productToUpdate = {
  //       id: productToUpdate.id,
  //       title: prod.title || productToUpdate.title,
  //       description: prod.description || productToUpdate.description,
  //       category: prod.category || productToUpdate.category,
  //       price: prod.price || productToUpdate.price,
  //       thumbnail: prod.thumbnail || productToUpdate.thumbnail,
  //       code: prod.code || productToUpdate.code,
  //       stock: prod.stock || productToUpdate.stock,
  //       status: prod.status || productToUpdate.status,
  //     };

  //     //probando las validaciones
  //     verificationTypeOfProducts(productToUpdate);
  //     verificationDataOfProducts(productToUpdate);
  //     const exist = notUpdated.find(
  //       (elements) => elements.code === productToUpdate.code
  //     );
  //     if (exist) {
  //       throw new Error(
  //         "The code: " +
  //           productToUpdate.code +
  //           " of the product title: " +
  //           productToUpdate.title +
  //           " already exist"
  //       );
  //     } else {
  //       console.log(
  //         "Successful update of the product title: " + productToUpdate.title
  //       );
  //       this.products = [productToUpdate, ...notUpdated];
  //     }

  //     this.products = [productToUpdate, ...notUpdated];
  //     //En la linea justo de abajo, se utiliza para convertir los datos en formato de string, y se coloca el segundo parametro (null) y el tercer paremetro (numero de tabulaciones que se desea), para que el archivo json en la base de datos se vea de forma mas ordenado, estos dos parametros son opcionales.
  //     const cartAString = JSON.stringify(this.products, null, 2);
  //     fs.writeFileSync(this.filePath, cartAString);
  //   }

  //   deleteProduct(id) {
  //     let productToDelete = this.getProductsById(id);
  //     let notDeleted = this.products.filter(function (elemento) {
  //       return elemento.id != id;
  //     });

  //     if (productToDelete) {
  //       //En la linea justo de abajo, se utiliza para convertir los datos en formato de string, y se coloca el segundo parametro (null) y el tercer paremetro (numero de tabulaciones que se desea), para que el archivo json en la base de datos se vea de forma mas ordenado, estos dos parametros son opcionales.
  //       const cartAString = JSON.stringify(notDeleted, null, 2);
  //       fs.writeFileSync(this.filePath, cartAString);
  //       return console.log("The id: " + id + " was deleted");
  //     } else {
  //       throw new Error("The id: " + id + " was not found");
  //     }
  //   }
}

export const cartsManager = new CartManager();
