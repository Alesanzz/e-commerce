import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest(`http://localhost:8080`);

describe("Test de API de carts", function () {
  this.timeout(10000);

  describe("Endpoint tipo GET /api/carts", () => {
    it("Ruta que debe recuperar todos los carritos de compras", async () => {
      const response = await requester.get("/api/carts").send();
      const { status, ok, _body } = response;

      expect(status).to.equal(200);
      expect(_body.data).to.be.an("array");
    });
  });

  describe("Endpoint tipo POST /api/carts", () => {
    it("Ruta que debe crear un carrito de compras", async () => {
      const response = await requester.post("/api/carts").send();
      const { status, ok, _body } = response;

      expect(status).to.equal(201);
      expect(_body).to.be.an("object");
      expect(_body.data).to.have.property("_id");
    });
  });

  describe("Endpoint tipo GET /api/carts/:id_cart", () => {
    it("Ruta que debe devolver un carrito de compras a partir de un id", async () => {
      const cartId = "64f5312963800aedb776ca8b";
      const response = await requester.get(`/api/carts/${cartId}`).send();
      const { status, ok, _body } = response;

      expect(status).to.equal(200);
      expect(_body).to.be.an("object");
      expect(_body.data._id).to.equal(cartId);
    });
  });

  describe("Endpoint tipo POST /api/carts/:id_cart/product/:id_product", () => {
    it("Ruta que deberia agregar un producto al carrito de compras", async () => {
      const cartId = "64f5312963800aedb776ca8b";
      const productId = "64cec7e64e757822cfb81799";

      const response = await requester
        .post(`/api/carts/${cartId}/product/${productId}`)
        .send();
      const { status, ok, _body } = response;

      expect(status).to.equal(201);
      //revisando si el producto realmente se agrego al carrito de compras
      const productsExist = _body.data.products.some((product) => {
        return product.product._id == productId;
      });
      expect(productsExist).to.be.true;
    });
  });

  describe("Endpoint tipo PUT /api/carts/:id_cart/products/:id_product", () => {
    it("Ruta que deberia modificar la cantidad de un producto ya ingresado al carrito", async () => {
      const cartId = "64f5312963800aedb776ca8b";
      const productId = "64cec7e64e757822cfb81799";
      const productQuantity = 15;

      const response = await requester
        .put(`/api/carts/${cartId}/products/${productId}`)
        .send({ quantity: productQuantity });
      const { status, ok, _body } = response;

      expect(status).to.equal(201);
      //revisando si se modifico la cantidad del producto en el carrito de compras
      const quantityChanged = _body.data.products.some((product) => {
        return (
          product.product._id == productId &&
          product.quantity == productQuantity
        );
      });
      expect(quantityChanged).to.be.true;
    });
  });

  describe("Endpoint tipo DELETE /api/carts/:id_cart", () => {
    it("Ruta que deberia vaciar todo el carrito de compras", async () => {
      const cartId = "64f5312963800aedb776ca8b";
      const response = await requester.delete(`/api/carts/${cartId}`).send();
      const { status, ok, _body } = response;

      expect(status).to.equal(200);
      expect(_body.msg).to.equal(
        `Se vacio el carrito de compras con el id ${cartId}`
      );
      expect(_body.data.products).that.is.undefined;
    });
  });
});
