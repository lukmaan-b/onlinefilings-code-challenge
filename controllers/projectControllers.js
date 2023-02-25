const { ObjectId } = require("mongodb");
const { getDb } = require("../db/db");
const Project = require("../models/project");
const Task = require("../models/task");
const TaskController = require("./taskController");

/**
 * ProjectController
 * @class
 * @classdesc ProjectController class
 *
 */
class ProjectController {
  /**
   * checkProjectExist
   * Checks if a project exist using it's id.
   * @param {ObjectId} id Project id to check if exist.
   * @returns {boolean} Returns true if project exist, false if not.
   */
  static async checkProjectExist(id) {
    const db = getDb();
    const project = await db.collection("projects").findOne({ _id: id });
    return !!project;
  }

  /**
   * throwErrorIfProjectNotExist
   * Throws an error if a project does not exist.
   * @param {ObjectId} id Project id to check if exist.
   */
  static async throwErrorIfProjectNotExist(id) {
    const projectExist = await this.checkProjectExist(id);
    if (!projectExist) {
      throw new Error("Project not found");
    }
  }

  /**
   * createProject
   * Creates a new project
   * @param {string} name Project name
   * @param {string} startDate Project start date
   * @param {string} dueDate Project due date
   * @returns {Project} Returns the created project
   */
  static async createProject(name, startDate, dueDate) {
    const db = getDb();
    const newProject = new Project(name, startDate, dueDate);
    await db.collection("projects").insertOne(newProject);
    return newProject;
  }

  /**
   * getProjects
   * Gets all projects
   * @returns {Project[]} Returns all projects
   */
  static async getProjects() {
    const db = getDb();
    const projects = await db.collection("projects").find().toArray();
    return projects;
  }

  /**
   * updateProject
   * Updates a project using it's id.
   * @param {ObjectId} id Id of project to update
   * @param {string} name New project name
   * @param {string} startDate New project start date
   * @param {string} dueDate New project due date
   * @returns {Project} Returns the updated project
   */
  static async updateProject(id, name, startDate, dueDate) {
    await this.throwErrorIfProjectNotExist(id);
    const db = getDb();
    const updatedProject = new Project(name, startDate, dueDate);
    await db
      .collection("projects")
      .updateOne({ _id: id }, { $set: updatedProject });
    return updatedProject;
  }

  /**
   * deleteProject
   * Deletes a project using it's id.
   * @param {string} id Id of project to delete
   *
   */
  static async deleteProject(id) {
    await this.throwErrorIfProjectNotExist(id);
    const db = getDb();
    await db.collection("projects").deleteOne({ _id: id });
  }

  /**
   * assignTaskToProject
   * Assigns a task to a project using the project id and task id.
   * If the task is already assigned to a project,
   * it will be removed from the previous project.
   * @param {ObjectId} projectId Project id to assign task to
   * @param {ObjectId} taskId Task id to assign to project
   *
   */
  static async assignTaskToProject(projectId, taskId) {
    // Check if project and task exist
    await this.throwErrorIfProjectNotExist(projectId);
    await TaskController.throwErrorIfTaskNotExist(taskId);

    const db = getDb();

    // Check if task is already assigned to a project
    const taskAssignedToProject = await db
      .collection("projects")
      .aggregate([
        {
          $lookup: {
            from: "tasks",
            localField: "tasks",
            foreignField: "_id",
            as: "tasks",
          },
        },
        {
          $match: {
            "tasks._id": taskId,
          },
        },
      ])
      .toArray();

    // If task is already assigned to this project do nothing.
    if (
      taskAssignedToProject.length > 0 &&
      taskAssignedToProject[0]._id === projectId
    ) {
      return;
    } else if (
      // If task is assigned to another project, remove it from that project.
      taskAssignedToProject.length > 0 &&
      taskAssignedToProject[0]._id !== projectId
    ) {
      // Remove task from previous project
      await db
        .collection("projects")
        .updateOne(
          { _id: taskAssignedToProject[0]._id },
          { $pull: { tasks: taskId } }
        );
    }
    // Add task to project
    await db
      .collection("projects")
      .updateOne({ _id: projectId }, { $push: { tasks: taskId } });
    await db
      .collection("tasks")
      .updateOne({ _id: taskId }, { $set: { projectId: projectId } });
  }

  /**
   * getTasksByProjectName
   * Gets all tasks assigned to a project using the project name.
   * @param {string} name Project name to search tasks for.
   * @returns {Task[]} Returns all tasks assigned to a project.
   */
  static async getTasksByProjectName(name) {
    const db = getDb();
    const tasks = await db
      .collection("tasks")
      .aggregate([
        {
          $lookup: {
            from: "projects",
            localField: "projectId",
            foreignField: "_id",
            as: "project",
          },
        },
        {
          $match: {
            "project.name": { $regex: name },
          },
        },
      ])
      .toArray();
    return tasks;
  }

  /**
   * getProjectsBySortDate
   * Gets all projects sorted by either start date or due date.
   * @param {string} sort Sort type. Can be either 'startDate' or 'dueDate'
   * @returns {Project[]} Returns all projects sorted by either start date or due date.
   */
  static async getProjectsBySortDate(sortDate) {
    if (sortDate !== "startDate" && sortDate !== "dueDate") {
      throw new Error("Invalid sort type");
    }
    const db = getDb();
    const sort = {};
    sort[sortDate] = 1;
    const projects = await db
      .collection("projects")
      .find()
      .sort(sort)
      .toArray();
    return projects;
  }
}

module.exports = ProjectController;
