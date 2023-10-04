const mongoose = require("mongoose");
const { User } = require("./user.model");

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  // _userid: {
  //   type: String,
  //   re: User,
  //   required: true,
  // },
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const List = mongoose.model("List", ListSchema);

module.exports = { List };
