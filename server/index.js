const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Task = require("./models/task.js");
require("dotenv").config();

const app = express();
const port = 5000;
app.use(bodyParser.json());

// Configure CORS for specific IP and localhost
const allowedOrigins = process.env.WHITELISTED_DOMAINS;
const corsOptions = {
  origin: (origin, callback) => {
    // Check if the origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (if needed)
  optionsSuccessStatus: 204, // Respond with a 204 status for preflight requests
};

// Apply CORS middleware globally to all routes 
app.use((req, res, next) => {
  const excludeRoutes = ['/test']; // You can include routes that don't use Whitelisted domains.
  if (excludeRoutes.includes(req.path)) {
    cors()(req, res, next);
  } else {
    cors(corsOptions)(req, res, next);
  }
});


app.get("/test", (req, res) => {
  res.send("Hello World the server is working!");
});

// create new task
app.post("/newtask", async (req, res) => {
  try {
    const { name, uid, status } = req.body;
    await Task.create({ name, uid, status });
    res.json({ message: "Task added" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const { uid } = req.query;
    const tasks = await Task.find({ uid: uid }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update ststus
app.put("/updatestatus", async (req, res) => {
  try {
    const { id, status } = req.body;
    await Task.findByIdAndUpdate(id, { status: status });
    res.json({ message: "Status updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update task name
app.put("/updatetaskname", async (req, res) => {
  try {
    const { id, name } = req.body;
    await Task.findByIdAndUpdate(id, { name: name });
    res.json({ message: "Task updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete task
app.delete("/deletetask", async (req, res) => {
  try {
    const { id } = req.query;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// connect to MongoDB
try {
  mongoose.connect(process.env.DATABASE_URL);
  console.log("MongoDB connected successfully");
} catch (error) {
  console.error(error);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
