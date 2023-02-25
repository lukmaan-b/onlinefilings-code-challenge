/**
 * this files contains the routes for the bonus endpoints
 * The routes are:
 * GET /due/projects - Get all projects with due tasks.
 * GET /due/tasks - Get all tasks with due projects.
 */
const express = require("express");
const BonusController = require("../controllers/bonusController");
const router = express.Router();

router.get("/due/projects", async (req, res) => {
  try {
    const projects = await BonusController.getAllProjectsWithDueTasks();
    res.send(projects);
  } catch (error) {
    res.status(400).send("Error getting projects");
  }
});

router.get("/due/tasks", async (req, res) => {
  try {
    const tasks = await BonusController.getAllTasksWithDueProjects();
    res.send(tasks);
  } catch (error) {
    res.status(400).send("Error getting tasks");
  }
});

module.exports = router;
