const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const {
  createUser,
  getAllUsers,
  addExerciseDetail,
  getUserLogsByIdAndQuery,
} = require("./controller/user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "false" }));

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Create new user using username
app.post("/api/users", (req, res, next) => {
  const { username } = req.body;

  createUser(username, function (err, data) {
    if (err) {
      return next(err);
    }

    return res.json(data);
  });
});

// Get all users details
app.get("/api/users", (req, res, next) => {
  getAllUsers(function (err, data) {
    if (err) {
      return next(err);
    }

    return res.json(data);
  });
});

// Add Exercise details to the existing user
app.post("/api/users/:_id/exercises", (req, res, next) => {
  const { _id: userId } = req.params;
  // console.log("Req params is: ", req.params);

  if (!userId || !req.body) {
    return next(new Error("Invalid userId or request body"));
  }

  addExerciseDetail(userId, req.body, function (err, data) {
    if (err) {
      return next(err);
    }

    return res.json(data);
  });
});

// GET full exercise log of any user
app.get("/api/users/:_id/logs", (req, res, next) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  if (!_id) {
    return next(new Error("Invalid Param: id"));
  }

  getUserLogsByIdAndQuery({_id, from, to, limit}, function (err, data) {
    if (err) {
      return next(err);
    }

    return res.json(data);
  });
});

// Error handler
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error");
  });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
