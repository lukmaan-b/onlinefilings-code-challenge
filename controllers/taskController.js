const { ObjectId } = require("mongodb");
const { getDb } = require("../db/db");
const Task = require("../models/task");

/**
 * TaskController
 * @class
 * @classdesc TaskController class
 *
 */
class TaskController {
  /**
   * createTask
   * Creates a new task
   * @param {string} name Tasks name
   * @param {string} status Tasks status
   * @param {string} dueDate Tasks due date
   * @param {string} startDate Tasks start date
   * @returns {Task} Returns the created task
   */
  static async createTask(name, status, dueDate, startDate) {
    const db = getDb();
    const newTask = new Task(name, status, startDate, dueDate);
    await db.collection("tasks").insertOne(newTask);
    return newTask;
  }

  /**
   * getTasks
   * Gets all tasks
   * @returns {Task[]} Returns all tasks
   */
  static async getTasks() {
    const db = getDb();
    const tasks = await db.collection("tasks").find().toArray();
    return tasks;
  }

  /**
   * updateTask
   * Updates a task using it's id.
   * @param {ObjectId} id Task id to update.
   * @param {string} name New task name
   * @param {string} status New task status
   * @param {string} dueDate New task due date
   * @param {string} startDate New task start date
   * @returns {Task} Returns the updated task
   */
  static async updateTask(id, name) {
    const db = getDb();
    const taskExist = db.collection("tasks").findOne({ _id: id });
    if (!taskExist) {
      throw new Error("Task not found");
    }
    await db.collection("tasks").updateOne({ _id: id }, { $set: { name } });
    return updatedTask;
  }

  /**
   * deleteTask
   * Deletes a task using it's id.
   * @param {ObjectId} id  Task id to delete.
   */
  static async deleteTask(id) {
    const db = getDb();
    const taskExist = await db.collection("tasks").findOne({ _id: id });
    if (!taskExist) {
      throw new Error("Task not found");
    }
    await db.collection("tasks").deleteOne({ _id: id });
  }

  /**
   * toggleTaskCompletion
   * Marks a task as done using it's id.
   * @param {ObjectId} id  Task id to mark as done.
   */
  static async toggleTaskCompletion(id) {
    const db = getDb();
    const taskExist = await db.collection("tasks").findOne({ _id: id });
    if (!taskExist) {
      throw new Error("Task not found");
    }

    let set = {};
    if (taskExist.status === "done") { // If task is done, mark it as to-do, remove done date and set start date to now.
      set = { status: "to-do", doneDate: null, startDate: new Date() };
    } else { // Else if task is not done, mark it as done and set done date.
      set = { status: "done", doneDate: new Date() };
    }
    await db.collection("tasks").updateOne({ _id: id }, { $set: set });
  }

  /**
   * getTasksByStatus
   * Gets all tasks by status.
   * @param {string} status Status to search tasks by.
   * @returns {Task[]} Returns all tasks with the given status.
   */
  static async getTasksByStatus(status) {
    const db = getDb();
    const tasks = await db
      .collection("tasks")
      .find({ status: { $regex: status } })
      .toArray();
    return tasks;
  }

  /**
   * getTasksByName
   * Gets all tasks by name.
   * @param {string} name Name to search tasks by.
   * @returns {Task[]} Returns all tasks with the given name.
   */
  static async getTasksByName(name) {
    const db = getDb();
    const tasks = await db
      .collection("tasks")
      .find({ name: { $regex: name } })
      .toArray();
    return tasks;
  }

  /**
   * getTasksBySortDate
   * Gets all tasks by sort date.
   * @param {string} sortDate Sort date to sort tasks by. Can be startDate, dueDate or doneDate.
   * @returns {Task[]} Returns all tasks sorted by the given sort date.
   */
  static async getTasksBySortDate(sortDate) {
    if (
      sortDate !== "startDate" &&
      sortDate !== "dueDate" &&
      sortDate !== "doneDate"
    ) {
      throw new Error("Invalid sort date");
    }
    const db = getDb();
    const sort = {};
    sort[sortDate] = 1;
    const tasks = await db
      .collection("tasks")
      .find({ doneDate: { $exists: true } })
      .sort(sort)
      .toArray();
    return tasks;
  }
}

module.exports = TaskController;
