const mongoose = require("mongoose");
const { User } = require("./user.model");

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  _userid: {
    type: mongoose.Types.ObjectId,
    re: User,
    required: true,
  },
});

const List = mongoose.model("List", ListSchema);

module.exports = { List };
