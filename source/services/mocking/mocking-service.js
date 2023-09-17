//@ts-check
import { fakerES } from "@faker-js/faker";
import { DAOFactory } from "../../dao/factory.js";

const productDAO = await DAOFactory("products");
const userDAO = await DAOFactory("users");

class MockingService {
  async generateUsers() {
    (async () => {
      const users = [];
      for (let i = 0; i < 2; i++) {
        users.push({
          first_name: fakerES.person.firstName(),
          last_name: fakerES.person.lastName(),
          age: fakerES.number.int({ min: 18, max: 99 }),
          country: fakerES.location.county(),
          email: fakerES.internet.email(),
          password: fakerES.internet.password({length: 10}),
          admin: fakerES.datatype.boolean(),
        });
      }
      try {
        await userDAO.createMany(users);
        console.log("Inserted ", users.length, " of users");
      } catch (error) {
        console.error("Error in the process of insert users: ", error);
      }
    })();
  }

  async generateProducts() {
    (async () => {
      const products = [];
      for (let i = 0; i < 10; i++) {
        products.push({
          title: fakerES.commerce.productName(),
          description: fakerES.commerce.productDescription(),
          category: fakerES.commerce.department(),
          price: fakerES.commerce.price({ min: 100, max: 999, dec: 0 }),
          thumbnail: fakerES.image.url(),
          code: fakerES.string.sample(5),
          stock: fakerES.number.int({ min: 1, max: 100 }),
          status: fakerES.datatype.boolean(),
        });
      }
      try {
        await productDAO.createMany(products);
        console.log("Inserted ", products.length, " of products");
      } catch (error) {
        console.error("Error in the process of insert products: ", error);
      }
    })();
  }
}

export const mockingService = new MockingService();
