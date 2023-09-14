const mongodb = require("mongodb");
const getdb = require("../util/database").getdb;
class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    const db = getdb();
    db.collection("users")
      .insertOne(this)
      .then()
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getdb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
