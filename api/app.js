const express = require("express");
const app = express();
const { mongoose } = require("./db/mongoose");
const bodyParser = require("body-parser");

const { List, Task } = require("./db/models");

app.use(bodyParser.json());

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

app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});
