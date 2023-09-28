const dotenv = require("dotenv");

dotenv.config();
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB successfully :)");
  })
  .catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
  });

module.exports = {
  mongoose,
};
