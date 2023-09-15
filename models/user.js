const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const getdb = require("../util/database").getdb;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getdb();
    db.collection("users")
      .insertOne(this)
      .then()
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );

    let newQuentity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuentity = this.cart.items[cartProductIndex].quentity + 1;
      updatedCartItems[cartProductIndex].quentity = newQuentity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quentity: newQuentity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getdb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(userId) {
    const db = getdb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
