/*
 * This file contains the routes for the tasks
 * The routes are:
 * POST /tasks/create - Create a new task.
 * GET /tasks/list - Get all tasks.
 * PUT /tasks/:id - Update a task.
 * DELETE /tasks/:id - Delete a task.
 * POST /tasks/:id/done - Mark a task as done.
 * GET /tasks/status/:status - Get all tasks with a specific status.
 * GET /tasks/name/:name - Get all tasks with a specific name.
 * GET /sort/date/:sortType - Get all tasks sorted by (startDate, dueDate, doneDate)
 *
 */

const express = require("express");
const { ObjectId } = require("mongodb");
const TaskController = require("../controllers/taskController");
const router = express.Router();
const { getDb } = require("../db/db");
const Task = require("../models/task");

/**
 * Create a new task.
 */
router.post("/create", async (req, res) => {
  try {
    const { name, status, dueDate, startDate } = req.body;
    const newTask = await TaskController.createTask(
      name,
      status,
      startDate,
      dueDate
    );
    res.send(newTask);
  } catch (error) {
    res.status(400).send("Error creating task");
  }
});

/**
 * Get all tasks.
 */
router.get("/list", async (req, res) => {
  try {
    const tasks = await TaskController.getTasks();
    res.send(tasks);
  } catch (error) {
    res.status(400).send("Error getting tasks");
  }
});

/**
 * Update a task.
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, status, dueDate, startDate } = req.body;
    const id = new ObjectId(req.params.id);
    const updatedTask = await TaskController.updateTask(
      id,
      name,
      status,
      dueDate,
      startDate
    );
    res.send(updatedTask);
  } catch (error) {
    res.status(400).send("Error updating task");
  }
});

/**
 * Delete a task.
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    await TaskController.deleteTask(id);
    res.send("Task deleted");
  } catch (error) {
    res.status(400).send("Error deleting task");
  }
});

/**
 * Mark a task as done.
 */
router.post("/:id/done", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
await TaskController.markTaskAsDone(id);
    res.send("Task Completed");
  } catch (error) {
    res.status(400).send("Error updating task");
  }
});

/**
 * Get all tasks with a specific status.
 */
router.get("/status/:status", async (req, res) => {
  try {
    
const tasks = await TaskController.getTasksByStatus(req.params.status);
    res.send(tasks);
  } catch (error) {
    res.status(400).send("Error getting tasks by status");
  }
});

/**
 * Get all tasks with a specific name.
 */
router.get("/name/:name", async (req, res) => {
  try {
    const tasks = await TaskController.getTasksByName(req.params.name);
    res.send(tasks);
  } catch (error) {
    res.status(400).send("Error getting tasks by name");
  }
});

/**
 * Get all tasks sorted by (startDate, dueDate, doneDate)
 */
router.get("/sort/date/:sortType", async (req, res) => {
  try {
    const tasks = await TaskController.getTasksSortedByDate(req.params.sortType);
    res.send(tasks);
  } catch (error) {
    res.status(400).send("Error sorting tasks");
  }
});

module.exports = router;