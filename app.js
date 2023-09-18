const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6507eb61f11a98a02b35d3ac")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "Shubham",
            email: "shubhamv387@gmail.com",
            cart: {
              items: [],
            },
          });
          return user.save();
        }
      })
      .then(() => {
        app.listen(3000, () => {
          console.log("Server is running on http://localhost:3000");
        });
      })
      .catch((error) => console.log(error.message));
  })
  .catch((error) => console.log(error.message));
