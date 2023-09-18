const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
  MongoClient.connect(process.env.MONGO_URL)
    .then((client) => {
      console.log("connected!");
      _db = client.db("shop1");
      cb();
    })
    .catch((err) => {
      console.log("I am getting error in mongoDB connection");
      console.log(err);
    });
};

const getdb = () => {
  if (_db) return _db;
  throw "no database found!";
};

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;
