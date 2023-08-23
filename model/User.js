const mongoose = require("mongoose");

const logSchema =  new mongoose.Schema({
  description: String,
  duration: Number,
  date: Number,
});

const schema = {
  username: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  log: {
    type: [logSchema],
    default: [],
  }
};

// Schema
const userSchema = new mongoose.Schema(schema, {
  collection: "User",
  timestamps: true,
});

// Create Index
userSchema.index({ _id: -1, createdAt: -1 });

const User = mongoose.model("User", userSchema);


module.exports = { User };
