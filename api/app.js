const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");
const bodyParser = require("body-parser");

const { List, Task } = require("./db/models");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:4200", // Update with your Angular app's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(express.json());
app.use(bodyParser.json());

// app.use(cors());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

//Lists
//Get all lists
app.get("/lists", (req, res) => {
  List.find({}).then((lists) => {
    res.send(lists);
  });
});

//Create lists
app.post("/lists", (req, res) => {
  let title = req.body.title;

  let newList = new List({
    title,
  });
  newList.save().then((listDoc) => {
    res.send(listDoc);
  });
});

//Update lists
app.patch("/lists/:id", (req, res) => {
  List.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

//Delete lists
app.delete("/lists/:id", (req, res) => {
  List.findOneAndRemove({
    _id: req.params.id,
  }).then((removedListDoc) => {
    res.send(removedListDoc);
  });
});

// View a specific list by ID and its tasks
app.get("/lists/:listId", async (req, res) => {
  const listId = req.params.listId;

  try {
    const list = await List.findById(listId);
    if (!list) {
      // If the list with the specified ID doesn't exist, return an error
      res.status(404).send("List not found");
    } else {
      // If the list exists, retrieve its tasks and send both the list and tasks
      const tasks = await Task.find({ _listId: listId });
      res.send({ list, tasks });
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//Display all Tasks
app.get("/lists/:listId/tasks", (req, res) => {
  Task.find({
    _listId: req.params.listId,
  }).then((tasks) => {
    res.send(tasks);
  });
});

// app.post("/lists/:listId/tasks", (req, res) => {
//   const listId = req.params.listId;
//   if (!listId) {
//     return res.status(400).send("List ID is required.");
//   }

//   List.findById(listId, (err, list) => {
//     if (err || !list) {
//       return res.status(404).send("List not found.");
//     }
//     let newTask = new Task({
//       title: req.body.title,
//       _listId: req.params.listId,
//     });
//     console.log("_listId:", newTask._listId);
//     newTask.save().then((newTaskDoc) => {
//       res.send(newTaskDoc);
//     });
//   });
// });

app.post("/lists/:listId/tasks", async (req, res) => {
  const listId = req.params.listId;
  if (!listId) {
    return res.status(400).send("List ID is required.");
  }

  try {
    // Check if the list with the provided ID exists in the database
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).send("List not found.");
    }

    const newTask = new Task({
      title: req.body.title,
      _listId: listId,
    });

    await newTask.save();
    res.send(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndUpdate(
    {
      _id: req.params.taskId,
      _listId: req.params.listId,
    },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndRemove({
    _id: req.params.taskId,
    _listId: req.params.listId,
  }).then((removeTaskDoc) => {
    res.send(removeTaskDoc);
  });
});

app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});
