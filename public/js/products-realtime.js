const socket = io();

const title = document.getElementById("input-title");
const description = document.getElementById("input-description");
const category = document.getElementById("input-category");
const price = document.getElementById("input-price");
const thumbnail = document.getElementById("input-thumbnail");
const code = document.getElementById("input-code");
const stock = document.getElementById("input-stock");
const divNewProduct = document.getElementById("div-new-product");
const botonSend = document.getElementById("button-send");
const botonReset = document.getElementById("button-reset");
const deleteButtons = document.getElementsByClassName("button-delete");

botonSend.addEventListener("click", function () {
  let newProduct = {
    title: title.value,
    description: description.value,
    category: category.value,
    price: Number(price.value),
    thumbnail: thumbnail.value,
    code: code.value,
    stock: Number(stock.value),
    status: Boolean(true),
  };
  //front emite y envia "msg_front_to_back"
  //socket.emit = es la configuracion para indicar que debe enviar el primer parametro al back
  //primer parametro = nombre del parametro que debe enviar
  //segundo parametro = el objeto que se envia al back
  socket.emit("new-product-created", newProduct);
  (title.value = ""),
    (description.value = ""),
    (category.value = ""),
    (price.value = ""),
    (thumbnail.value = ""),
    (code.value = ""),
    (stock.value = "");
});

//para enviar el id del producto que quiero eliminar
for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", function () {
      let iidd = Number(deleteButtons[i].value);
  
      socket.emit("delete-product", iidd);
    });
  }


// socket.on("all-the-products", (newProduct) => {
//    divNewProduct.innerHTML = `
//   <p>Nombre del producto: ${newProduct.title}</p>
//   <p>Descripcion: ${newProduct.description}</p>
//   <p>Categoria: ${newProduct.category}</p>
//   <p>Precio: ${newProduct.price}</p>
//   <p>Direccion de imagen: ${newProduct.thumbnail}</p>
//   <p>Codigo: ${newProduct.code}</p>
//   <p>Stock actual: ${newProduct.stock}</p>
//   <hr />`;
// });


botonReset.addEventListener("click", function () {
  (title.value = ""),
    (description.value = ""),
    (category.value = ""),
    (price.value = ""),
    (thumbnail.value = ""),
    (code.value = ""),
    (stock.value = "");
});
