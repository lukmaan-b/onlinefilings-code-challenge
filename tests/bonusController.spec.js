const BonusController = require("../controllers/bonusController");
const { getDb, closeConnection, clearTasks, connectDb, clearProjects } = require("../db/db");
const Project = require("../models/project");
const Task = require("../models/task");

describe("bounsController", () => {
  beforeAll(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await clearProjects();
    await clearTasks();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe("getAllProjectsWithDueTasks", () => {
    it.only("should return all projects with due tasks", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      const projectToCreate2 = new Project(
        "Project 2",
        "2023-01-01",
        "2023-01-01"
      );
      const taskToCreate = new Task(
        "Task 1",
        'to-do',
        new Date(),
        "2023-01-02",
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      projectToCreate.tasks = [taskToCreate._id];
      await getDb()
        .collection("projects")
        .insertMany([projectToCreate, projectToCreate2]);
      const projects = await BonusController.getAllProjectsWithDueTasks();
      expect(projects.length).toBe(1);
      expect(projects[0].name).toBe(projectToCreate.name);
    });
    it("should return empty array if no projects with due tasks", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      const projectToCreate2 = new Project(
        "Project 2",
        "2023-01-01",
        "2023-01-01"
      );
      const taskToCreate = new Task(
        "Task 1",
        'to-do',
        "2023-01-01",
        "2023-01-01",
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      projectToCreate.tasks = [taskToCreate._id];
      await getDb()
        .collection("projects")
        .insertMany([projectToCreate, projectToCreate2]);
      const projects = await BonusController.getAllProjectsWithDueTasks();
      expect(projects.length).toBe(0);
    });
  });

  describe("getAllTasksWithDueDate", () => {
    it("should return all tasks if project due date is today", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        new Date(),
      );
      const projectToCreate2 = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01",
      );
      await getDb()
        .collection("projects")
        .insertMany([projectToCreate, projectToCreate2]);
      const taskToCreate = new Task(
        "Task 1",
        'to-do',
        "2023-01-01",
        "2023-01-01",
      );
      taskToCreate.projectId = projectToCreate._id;
      const taskToCreate2 = new Task(
        "Task 1",
        'to-do',
        "2023-01-01",
        "2023-01-01",
      );
      taskToCreate2.projectId = projectToCreate2._id;
      await getDb().collection("tasks").insertMany([taskToCreate, taskToCreate2]);
      const tasks = await BonusController.getAllTasksWithDueProjects();
      expect(tasks.length).toBe(1);
      expect(tasks[0].name).toBe(taskToCreate.name);
    });
    it("should return empty array if no tasks with due date", async () => {
      const tasks = await BonusController.getAllTasksWithDueProjects();
      expect(tasks.length).toBe(0);
    });
  });  
});