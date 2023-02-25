const express = require("express");
const BonusController = require("../controllers/bonusController");
const router = express.Router();
const { getDb } = require("../db/db");

router.get("/due/projects", async (req, res) => {
  try {
    const projects = await BonusController.getAllProjectsWithDueTasks();
    res.send(projects);

  } catch (error) {
    console.log("🚀 ~ file: bonus.router.js:33 ~ router.get ~ error:", error)
    res.status(400).send("Error getting projects");
  }
});

router.get("/due/tasks", async (req, res) => {
  try {
const task = await BonusController.getAllTasksWithDueProjects();
    res.send(tasks);
  } catch (error) {
    res.status(400).send("Error getting tasks");
  }
});

module.exports = router;