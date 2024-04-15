const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema({
  name: { type: String, required: true, trim: true },
  uid: { type: String, required: true },
  status: { type: Boolean, required: true },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Task = model("Task", taskSchema);

module.exports = Task;