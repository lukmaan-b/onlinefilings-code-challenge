/**
 * This file contains the routes for the projects
 * The routes are:
 * POST /projects/create - Create a new project.
 * GET /projects/list - Get all projects.
 * PUT /projects/:id - Update a project.
 * DELETE /projects/:id - Delete a project.
 * POST /projects/assign/:projectId/:taskId - Assign a task to a project.
 * GET /projectName/:name - Get all tasks by project name.
 * GET /sort/date/:sortType - Get all projects sorted by (startDate, dueDate)
 */
const express = require("express");
const { ObjectId } = require("mongodb");
const ProjectController = require("../controllers/projectControllers");
const router = express.Router();

/**
 * Create a new project.
 */
router.post("/create", async (req, res) => {
  try {
    const { name, startDate, dueDate } = req.body;
    const newProject = await ProjectController.createProject(
      name,
      startDate,
      dueDate
    );
    res.send(newProject);
  } catch (error) {
    res.status(400).send("Error creating project");
  }
});

/**
 * Get all projects.
 */
router.get("/list", async (req, res) => {
  try {
    const projects = await ProjectController.getProjects();
    res.send(projects);
  } catch (error) {
    res.status(400).send("Error getting projects");
  }
});

/**
 * Update a project.
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, startDate, dueDate } = req.body;
    const id = new ObjectId(req.params.id);
    const updatedProject = await ProjectController.updateProject(
      id,
      name,
      startDate,
      dueDate
    );
    res.send(updatedProject);
  } catch (error) {
    console.log(
      "🚀 ~ file: projects.router.js:39 ~ router.put ~ error:",
      error
    );
    res.status(400).send("Error updating project");
  }
});

/**
 * Delete a project.
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    await ProjectController.deleteProject(id);
    res.send("Project deleted");
  } catch (error) {
    res.status(400).send("Error deleting project");
  }
});

/**
 * Assign a task to a project.
 */
router.post("/assign/:projectId/:taskId", async (req, res) => {
  try {
    const projectId = new ObjectId(req.params.projectId);
    const taskId = new ObjectId(req.params.taskId);
    await ProjectController.assignTaskToProject(projectId, taskId);
    res.send("Task assigned to project");
  } catch (error) {
    res.status(400).send("Error assigning task to project");
  }
});

/**
 * Get all tasks by project name.
 */
router.get("/projectName/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const tasks = await ProjectController.getTasksByProjectName(name);
    res.send(tasks);
  } catch (error) {
    res.status(400).send("Error getting tasks");
  }
});

/**
 * Get all projects sorted by (startDate, dueDate)
 */
router.get("/sort/date/:sortType", async (req, res) => {
  try {
    const sortType = req.params.sortType;
    const projects = await ProjectController.getProjectsBySortDate(sortType);
    res.send(projects);
  } catch (error) {
    res.status(400).send("Error getting projects");
  }
});

module.exports = router;
