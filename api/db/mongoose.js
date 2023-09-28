const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://swethakeerthipati:R8z42Ztvqf3GUJA3@cluster0.d0sfkdd.mongodb.net/Tasks",
    { useNewUrlParser: true }
  )
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
