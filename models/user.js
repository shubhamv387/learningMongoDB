const mongoose = require("mongoose");
const Product = require("./product");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    (cp) => cp.productId.toString() === product._id.toString()
  );

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.getCart = function () {
  const productIds = this.cart.items.map((i) => i.productId);
  return Product.find({ _id: { $in: productIds } })
    .then((products) => {
      // console.log(products);
      if (productIds.length !== products.length) {
        const updatedCart = products.map((p) => {
          return this.cart.items.find((i) => {
            return i.productId.toString() === p._id.toString();
          });
        });

        return User.updateOne(
          { _id: this._id },
          { $set: { cart: { items: updatedCart } } }
        ).then((result) => {
          return products.map((p) => {
            return {
              ...p,
              quantity: this.cart.items.find((i) => {
                return i.productId.toString() === p._id.toString();
              }).quantity,
            };
          });
        });
      } else
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
    })
    .catch((err) => console.log(err));
};

userSchema.methods.deleteItemFromCart = function (prodId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    console.log(item.productId.toString() === prodId.toString());
    return item.productId.toString() !== prodId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
