const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.products = [];
    this.filePath = path.resolve(__dirname, "./products.json");

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
    if (
      //validando el titulo
      !newP.title ||
      newP.title === null ||
      newP.title === undefined ||
      newP.title === ""
    ) {
      throw new Error("The tittle must be completed");
    }
    if (
      //validando la descripcion
      !newP.description ||
      newP.description === null ||
      newP.description === undefined ||
      newP.description === ""
    ) {
      throw new Error("The description must be completed");
    }
    if (
      //validando el precio
      !newP.price ||
      newP.price === null ||
      newP.price === undefined ||
      newP.price === ""
    ) {
      throw new Error("The price must be completed");
    }
    if (
      //validando el thumbnail
      !newP.thumbnail ||
      newP.thumbnail === null ||
      newP.thumbnail === undefined ||
      newP.thumbnail === ""
    ) {
      throw new Error("The thumbnail must be completed");
    }
    if (
      //validando el codigo
      !newP.code ||
      newP.code === null ||
      newP.code === undefined ||
      newP.code === ""
    ) {
      throw new Error("The code must be completed");
    }
    if (
      //validando que el codigo no se repita con otro producto
      this.products.find((prod) => prod.code == newP.code)
    ) {
      throw new Error(
        "The code: " +
          newP.code +
          " of the product title: " +
          newP.title +
          " already exist"
      );
    }
    if (
      //validando el stock
      !newP.stock ||
      newP.stock === null ||
      newP.stock === undefined ||
      newP.stock === ""
    ) {
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
    this.#verificationProducts(newProduct);
    const exist = notUpdated.find((elements) => elements.code == prod.code);
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
    //otra forma de hacerlo
    //   let index = this.products.findIndex((elements) => elements.id == id);
    //   if (index !== -1) {
    //     this.products.splice(index, 1);

    //     const productAString = JSON.stringify(this.products, null, 2);
    //     fs.writeFileSync(this.filePath, productAString);
    //     return console.log("The id: " + id + " was deleted");
    //   } else {
    //     throw new Error("The id: " + id + " was not found");
    //   }
  }
}

const programa = new ProductManager();

//probando el funcionamiento
// programa.addProduct({
//   title: "coma2",
//   description: "Este producto es una prueba",
//   price: 100,
//   thumbnail: "www",
//   code: "ass14",
//   stock: 100,
// });

//console.log(programa.updateProduct(3, { title: "alfin", stock: 200,  price: 200,  }));
