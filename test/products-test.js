import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest(`http://localhost:8080`);

describe("Test de API de products", function () {
  this.timeout(10000);

  describe("Endpoint tipo GET /api/products", () => {
    it("Ruta que debe recuperar todos los productos", async () => {
      const response = await requester.get("/api/products").send();
      const { status, ok, _body } = response;

      expect(status).to.equal(200);
      expect(_body.data).to.be.an("array");
    });
  });

  describe("Endpoint tipo POST /api/products", () => {
    it("Ruta que debe crear un nuevo producto", async () => {
      let newCode = Math.floor(Math.random() * 9000) + 1000;
      const newProduct = {
        title: "Test Product",
        description: "Test Product Description",
        category: "Test",
        price: 111,
        thumbnail: "www",
        code: newCode,
        stock: 111,
        status: true,
      };
      const response = await requester.post("/api/products").send(newProduct);
      const { status, ok, _body } = response;

      expect(status).to.equal(201);
      expect(_body).to.be.an("object");
      expect(_body.data).to.have.property("_id");
    });
  });

  describe("Endpoint tipo GET /api/products/:id", () => {
    it("Ruta que debe devolver un solo producto a partir de un id", async () => {
      const productId = "64cec7e64e757822cfb81799";
      const response = await requester.get(`/api/products/${productId}`).send();
      const { status, ok, _body } = response;

      expect(status).to.equal(200);
      expect(_body).to.be.an("object");
      expect(_body.data._id).to.equal(productId);
    });
  });

  describe("Endpoint tipo PUT /api/products/:id", () => {
    it("Ruta que deberia modificar algun dato de un producto ya existente", async () => {
      const productId = "64cec7e64e757822cfb81799";
      const newData = {
        title: "Test Product",
        description: "Test Product Description",
        category: "Test",
        price: 111,
        thumbnail: "www",
        code: `Code_${Math.random()}`,
        stock: 111,
        status: true,
      };
      const response = await requester
        .put(`/api/products/${productId}`)
        .send(newData);
      const { status, ok, _body } = response;

      console.log(_body);
      expect(status).to.equal(201);
      expect(_body.status).to.equal(`Success`);
    });
  });

  describe("Endpoint tipo DELETE /api/products/:id", () => {
    it("should delete an existing product", async () => {
      const productId = "64cee348e091ab3ab2a063af";
      const response = await requester
        .delete(`/api/products/${productId}`)
        .send();
      const { status, ok, _body } = response;

      expect(status).to.equal(200);
      expect(_body.msg).to.equal(
        `Se elimino el producto con el id ${productId}`
      );
      expect(_body.data.products).that.is.undefined;
    });
  });
});
