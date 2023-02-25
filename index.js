const express = require("express");
const { connectDb } = require("./db/db");
const app = express();

const PORT = 4000;

app.use(express.json());

// Connect to the local MongoDB database.
connectDb("todoList");
const tasksRouter = require("./routers/tasks.router");
const projectRouter = require("./routers/projects.router");
const bonusRouter = require("./routers/bonus.router");

// Tasks router
app.use("/tasks", tasksRouter);

// Projects router
app.use("/projects", projectRouter);

// Bonus router
app.use("/bonus", bonusRouter);

// Start the server
app.listen(PORT, () => console.log(`Server running - port ${PORT}`));
