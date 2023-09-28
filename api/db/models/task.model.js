const mongoose = require("mongoose");

const TasksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  // _listId: {
  //   // type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   type: mongoose.Types.ObjectId,
  // },
});

const Task = mongoose.model("Task", TasksSchema);

module.exports = { Task };
