const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");
const bodyParser = require("body-parser");

const { List, Task, User } = require("./db/models");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const corsOptions = {
  origin: "http://localhost:4200", // Update with your Angular app's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

//CORS Headers middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});

//Authenication Middelware - to check a valid JWT token

let authenticate = (req, res, next) => {
  let token = req.header("x-access-token");

  //verify jwt
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) {
      res.status(401).send(err);
    } else {
      req.user_id = decoded._id;
      next();
    }
  });
};

//Verify refresh token

let verifySession = (req, res, next) => {
  // grab the refresh token from the request header
  let refreshToken = req.header("x-refresh-token");

  // grab the _id from the request header
  let _id = req.header("_id");

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        // user couldn't be found
        return Promise.reject({
          error:
            "User not found. Make sure that the refresh token and user id are correct",
        });
      }

      // if the code reaches here - the user was found
      // therefore the refresh token exists in the database - but we still have to check if it has expired or not

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
        if (session.token === refreshToken) {
          // check if the session has expired
          if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
            // refresh token has not expired
            isSessionValid = true;
          }
        }
      });

      if (isSessionValid) {
        // the session is VALID - call next() to continue with processing this web request
        next();
      } else {
        // the session is not valid
        return Promise.reject({
          error: "Refresh token has expired or the session is invalid",
        });
      }
    })
    .catch((e) => {
      res.status(401).send(e);
    });
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
app.get("/lists", authenticate, (req, res) => {
  List.find({
    _userid: req.user._id,
  }).then((lists) => {
    res.send(lists);
  });
});

//Create lists
app.post("/lists", authenticate, (req, res) => {
  let title = req.body.title;

  let newList = new List({
    title,
    _userId: req.user_id,
  });
  newList.save().then((listDoc) => {
    res.send(listDoc);
  });
});

//Update lists
app.patch("/lists/:id", authenticate, (req, res) => {
  List.findOneAndUpdate(
    { _id: req.params.id, _userId: req.user_id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

//Delete lists
app.delete("/lists/:id", authenticate, (req, res) => {
  List.findOneAndRemove({
    _id: req.params.id,
    _userId: req.user_id,
  }).then((removedListDoc) => {
    res.send(removedListDoc);

    //delete all the tasks that are in delete list
    deleteTasksFromList(removedListDoc._id);
  });
});

// View a specific list by ID and its tasks
app.get("/lists/:listId", authenticate, async (req, res) => {
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
app.get("/lists/:listId/tasks", authenticate, (req, res) => {
  Task.find({
    _listId: req.params.listId,
    _userId: req.user_id,
  }).then((tasks) => {
    res.send(tasks);
  });
});

// app.post("/lists/:listId/tasks", authenticate, async (req, res) => {
//   const listId = req.params.listId;
//   if (!listId) {
//     return res.status(400).send("List ID is required.");
//   }

//   try {
//     // Check if the list with the provided ID exists in the database
//     const list = await List.findById(listId);
//     if (!list) {
//       return res.status(404).send("List not found.");
//     }

//     const newTask = new Task({
//       title: req.body.title,
//       _listId: listId,
//     });

//     await newTask.save();
//     res.send(newTask);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal server error");
//   }
// });

app.post("/lists/:listId/tasks", authenticate, (req, res) => {
  // We want to create a new task in a list specified by listId

  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        // list object with the specified conditions was found
        // therefore the currently authenticated user can create new tasks
        return true;
      }

      // else - the list object is undefined
      return false;
    })
    .then((canCreateTask) => {
      if (canCreateTask) {
        let newTask = new Task({
          title: req.body.title,
          _listId: req.params.listId,
        });
        newTask.save().then((newTaskDoc) => {
          res.send(newTaskDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

// app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
//   Task.findOneAndUpdate(
//     {
//       _id: req.params.taskId,
//       _listId: req.params.listId,
//     },
//     {
//       $set: req.body,
//     }
//   ).then(() => {
//     res.send({ message: "Updated Successfully" });
//   });
// });

app.patch("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
  // We want to update an existing task (specified by taskId)

  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        // list object with the specified conditions was found
        // therefore the currently authenticated user can make updates to tasks within this list
        return true;
      }

      // else - the list object is undefined
      return false;
    })
    .then((canUpdateTasks) => {
      if (canUpdateTasks) {
        // the currently authenticated user can update tasks
        Task.findOneAndUpdate(
          {
            _id: req.params.taskId,
            _listId: req.params.listId,
          },
          {
            $set: req.body,
          }
        ).then(() => {
          res.send({ message: "Updated successfully." });
        });
      } else {
        res.sendStatus(404);
      }
    });
});

// app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
//   Task.findOneAndRemove({
//     _id: req.params.taskId,
//     _listId: req.params.listId,
//   }).then((removeTaskDoc) => {
//     res.send(removeTaskDoc);
//   });
// });

//USER Routes

app.delete("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        // list object with the specified conditions was found
        // therefore the currently authenticated user can make updates to tasks within this list
        return true;
      }

      // else - the list object is undefined
      return false;
    })
    .then((canDeleteTasks) => {
      if (canDeleteTasks) {
        Task.findOneAndRemove({
          _id: req.params.taskId,
          _listId: req.params.listId,
        }).then((removedTaskDoc) => {
          res.send(removedTaskDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

//USer Routes
app.post("/users", (req, res) => {
  // User sign up

  let body = req.body;
  let newUser = new User(body);

  newUser
    .save()
    .then(() => {
      return newUser.createSession();
    })
    .then((refreshToken) => {
      // Session created successfully - refreshToken returned.
      // now we geneate an access auth token for the user

      return newUser.generateAccessAuthToken().then((accessToken) => {
        // access auth token generated successfully, now we return an object containing the auth tokens
        return { accessToken, refreshToken };
      });
    })
    .then((authTokens) => {
      res
        .header("x-refresh-token", authTokens.refreshToken)
        .header("x-access-token", authTokens.accessToken)
        .send(newUser);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

// POST /users/login

app.post("/users/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password)
    .then((user) => {
      return user
        .createSession()
        .then((refreshToken) => {
          // Session created successfully - refreshToken returned.
          // now we geneate an access auth token for the user

          return user.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken };
          });
        })
        .then((authTokens) => {
          // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
          res
            .header("x-refresh-token", authTokens.refreshToken)
            .header("x-access-token", authTokens.accessToken)
            .send(user);
        });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

//GET /users/me/access-token
app.get("/users/me/access-token", verifySession, (req, res) => {
  // we know that the user/caller is authenticated and we have the user_id and user object available to us
  req.userObject
    .generateAccessAuthToken()
    .then((accessToken) => {
      res.header("x-access-token", accessToken).send({ accessToken });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});
//Delete method
let deleteTasksFromList = (_listId) => {
  Task.deleteMany({
    _listId,
  }).then(() => {
    console.log("Tasks from " + _listId + " were deleted!");
  });
};

app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});
