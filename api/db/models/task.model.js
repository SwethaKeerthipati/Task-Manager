const mongoose = require("mongoose");

const TasksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },

  _listId: {
    type: String,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", TasksSchema);

module.exports = { Task };
