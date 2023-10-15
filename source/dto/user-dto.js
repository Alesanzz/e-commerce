export default class UserDTO {
  constructor(user) {
    (this.id = user.id),
      (this.fullname = user.first_name + " " + user.last_name),
      (this.email = user.email),
      (this.age = user.age),
      (this.roll = user.admin),
      (this.cart = user.cart);
  }
}
