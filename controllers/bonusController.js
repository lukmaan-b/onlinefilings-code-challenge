/**
 * BonusController
 * @class
 * @classdesc BonusController class
 *
 */
class BonusController {
  /**
   * getAllProjectsWithDueTasks
   * Gets all projects with due tasks
   * @returns {Project[]} Returns all projects with due tasks
   */
  static async getAllProjectsWithDueTasks() {
    const db = getDb();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const projects = await db
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
            tasks: {
              $elemMatch: { dueDate: { $gte: yesterday, $lt: tomorrow } },
            },
          },
        },
      ])
      .toArray();

    return projects;
  }

  /**
   * getAllTasksWithDueProjects
   * Gets all tasks with due projects
   * @returns {Task[]} Returns all tasks with due projects
   */
  static async getAllTasksWithDueProjects() {
    const db = getDb();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
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
            "project.dueDate": { $gte: yesterday, $lt: tomorrow },
          },
        },
      ])
      .toArray();
    return tasks;
  }
}

module.exports = BonusController;
