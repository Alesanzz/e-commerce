import fs from "fs";
import path from "path";
import { __dirname } from "../middlewares/dirname.js";

class ProductManager {
  constructor() {
    this.products = [];
    this.filePath = path.resolve(__dirname, "../dataBase/products.json");

    //comprobando si ya existe la base de datos o no existe
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "");
    } else {
      //leyendo la base de datos
      let datos = fs.readFileSync(this.filePath, "utf-8");
      //para devolver el string a su formato original
      const productsAObject = JSON.parse(datos);
      this.products = productsAObject;
    }
  }

  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    const encontrado = this.products.find((elements) => elements.id == id);
    if (encontrado) {
      return encontrado;
    } else {
      throw new Error("The id: " + id + " was not found");
    }
  }

  #newId() {
    let maxId = this.products.reduce(
      (accomulador, producto) => Math.max(accomulador, producto.id),
      0
    );
    let newId = maxId + 1;
    return newId;
  }
  #verificationProducts(newP) {
    //validando el titulo
    if (!newP.title || newP.title === "") {
      throw new Error("The tittle must be completed");
    }
    //validando la descripcion
    if (!newP.description || newP.description === "") {
      throw new Error("The description must be completed");
    }
    //validando el precio
    if (!newP.price || newP.price === "") {
      throw new Error("The price must be completed");
    }
    //validando el thumbnail
    if (!newP.thumbnail || newP.thumbnail === "") {
      throw new Error("The thumbnail must be completed");
    }
    //validando el codigo
    if (!newP.code || newP.code === "") {
      throw new Error("The code must be completed");
    }
    //validando que el codigo no se repita con otro producto
    if (this.products.find((prod) => prod.code == newP.code)) {
      throw new Error(
        "The code: " +
          newP.code +
          " of the product title: " +
          newP.title +
          " already exist"
      );
    }
    //validando el stock
    if (!newP.stock || newP.stock === "") {
      throw new Error("The stock must be completed");
    }
  }

  addProduct(dato) {
    let newProduct = {
      id: this.#newId(),
      title: dato.title,
      description: dato.description,
      price: dato.price,
      thumbnail: dato.thumbnail,
      code: dato.code,
      stock: dato.stock,
    };

    //probando las validaciones
    this.#verificationProducts(newProduct);
    //si pasa la validaciones --->
    console.log("Successful record of the product title: " + newProduct.title);
    this.products = [...this.products, newProduct];

    //En la linea justo de abajo, se utiliza para convertir los datos en formato de string, y se coloca el segundo parametro (null) y el tercer paremetro (numero de tabulaciones que se desea), para que el archivo json en la base de datos se vea de forma mas ordenado, estos dos parametros son opcionales.
    const productAString = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.filePath, productAString);
  }

  updateProduct(id, prod) {
    let productToUpdate = this.getProductsById(id);
    let notUpdated = this.products.filter(function (elemento) {
      return elemento.id !== id;
    });

    productToUpdate = {
      id: productToUpdate.id,
      title: prod.title || productToUpdate.title,
      description: prod.description || productToUpdate.description,
      price: prod.price || productToUpdate.price,
      thumbnail: prod.thumbnail || productToUpdate.thumbnail,
      code: prod.code || productToUpdate.code,
      stock: prod.stock || productToUpdate.stock,
    };

    //probando las validaciones
    const exist = notUpdated.find(
      (elements) => elements.code === productToUpdate.code
    );
    if (exist) {
      throw new Error(
        "The code: " +
          productToUpdate.code +
          " of the product title: " +
          productToUpdate.title +
          " already exist"
      );
    } else {
      console.log(
        "Successful update of the product title: " + productToUpdate.title
      );
      this.products = [productToUpdate, ...notUpdated];
    }

    //En la linea justo de abajo, se utiliza para convertir los datos en formato de string, y se coloca el segundo parametro (null) y el tercer paremetro (numero de tabulaciones que se desea), para que el archivo json en la base de datos se vea de forma mas ordenado, estos dos parametros son opcionales.
    const productAString = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.filePath, productAString);
  }

  deleteProduct(id) {
    let productToDelete = this.getProductsById(id);
    let notDeleted = this.products.filter(function (elemento) {
      return elemento.id !== id;
    });

    if (productToDelete) {
      const productAString = JSON.stringify(notDeleted, null, 2);
      fs.writeFileSync(this.filePath, productAString);
      return console.log("The id: " + id + " was deleted");
    } else {
      throw new Error("The id: " + id + " was not found");
    }
  }
}

export const productManager = new ProductManager();