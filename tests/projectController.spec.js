const ProjectController = require("../controllers/projectControllers");
const {
  connectDb,
  closeConnection,
  getDb,
  clearProjects,
} = require("../db/db");
const Project = require("../models/project");
const Task = require("../models/task");

describe("projectController", () => {
  beforeAll(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await clearProjects();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe("checkProjectExist", () => {
    it("should return true if project exist", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb().collection("projects").insertOne(projectToCreate);
      const projectExist = await ProjectController.checkProjectExist(
        projectToCreate._id
      );
      expect(projectExist).toBe(true);
    });
    it("should return false if project doesn't exist", async () => {
      const projectExist = await ProjectController.checkProjectExist(
        "invalidId"
      );
      expect(projectExist).toBe(false);
    });
  });

  describe("throwErrorIfProjectNotExist", () => {
    it("should throw an error if project does not exist", async () => {
      expect(
        ProjectController.throwErrorIfProjectNotExist("invalidId")
      ).rejects.toThrow("Project not found");
    });
  });

  describe("createProject", () => {
    it("should create a new project", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      const createdProject = await ProjectController.createProject(
        projectToCreate.name,
        projectToCreate.startDate,
        projectToCreate.dueDate
      );
      expect(createdProject).toEqual(expect.objectContaining(projectToCreate));
    });
  });

  describe("getProjects", () => {
    it("should get all projects", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      const projectToCreate2 = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb()
        .collection("projects")
        .insertMany([projectToCreate, projectToCreate2]);
      const projects = await ProjectController.getProjects();
      expect(projects).toEqual([projectToCreate, projectToCreate2]);
      expect(projects.length).toBe(2);
    });
  });

  describe("updateProject", () => {
    it("should update a project", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb().collection("projects").insertOne(projectToCreate);
      const updatedProject = await ProjectController.updateProject(
        projectToCreate._id,
        "TEST NAME",
        "2023-01-02",
        "2023-01-03"
      );
      expect(updatedProject.name).toBe("TEST NAME");
      expect(updatedProject.startDate.toISOString()).toBe(
        new Date("2023-01-02").toISOString()
      );
      expect(updatedProject.dueDate.toISOString()).toBe(
        new Date("2023-01-03").toISOString()
      );
    });
  });

  describe("deleteProject", () => {
    it("should delete a project", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb().collection("projects").insertOne(projectToCreate);
      await ProjectController.deleteProject(projectToCreate._id);
      const project = await getDb()
        .collection("projects")
        .findOne({ _id: projectToCreate._id });
      expect(project).toBeNull();
    });
  });

  describe("assignTaskToProject", () => {
    it("should assign a task to a project", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-03-01",
        "2023-01-01"
      );
      await getDb().collection("projects").insertOne(projectToCreate);
      const taskToCreate = new Task(
        "Task 1",
        "to-do",
        "2023-03-01",
        "2023-01-01"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await ProjectController.assignTaskToProject(
        projectToCreate._id,
        taskToCreate._id
      );
      const project = await getDb()
        .collection("projects")
        .findOne({ _id: projectToCreate._id });
      expect(project.tasks).toEqual([taskToCreate._id]);
    });
    it("should not unassign a task to a project if task is already assigned", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb().collection("projects").insertOne(projectToCreate);
      const taskToCreate = new Task(
        "Task 1",
        "to-do",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await ProjectController.assignTaskToProject(
        projectToCreate._id,
        taskToCreate._id
      );
      await ProjectController.assignTaskToProject(
        projectToCreate._id,
        taskToCreate._id
      );
      const project = await getDb()
        .collection("projects")
        .findOne({ _id: projectToCreate._id });
      expect(project.tasks).toEqual([taskToCreate._id]);
    });
    it("should unassign a task to a project if task is already assigned", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      const projectToCreate2 = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb()
        .collection("projects")
        .insertMany([projectToCreate, projectToCreate2]);
      const taskToCreate = new Task(
        "Task 1",
        "to-do",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await ProjectController.assignTaskToProject(
        projectToCreate._id,
        taskToCreate._id
      );
      await ProjectController.assignTaskToProject(
        projectToCreate2._id,
        taskToCreate._id
      );
      const projectToCreateDb = await getDb()
        .collection("projects")
        .findOne({ _id: projectToCreate._id });
      const projectToCreate2Db = await getDb()
        .collection("projects")
        .findOne({ _id: projectToCreate2._id });
      expect(projectToCreateDb.tasks).toEqual([]);
      expect(projectToCreate2Db.tasks).toEqual([taskToCreate._id]);
    });
    it("should set projectId for task when assigning task to project", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb().collection("projects").insertOne(projectToCreate);
      const taskToCreate = new Task(
        "Task 1",
        "to-do",
        "2023-03-01",
        "2023-01-01"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await ProjectController.assignTaskToProject(
        projectToCreate._id,
        taskToCreate._id
      );
      const task = await getDb()
        .collection("tasks")
        .findOne({ _id: taskToCreate._id });
      expect(task.projectId).toEqual(projectToCreate._id);
    });
  });

  describe("getTasksByProjectName", () => {
    it("should get all tasks by project name", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb().collection("projects").insertOne(projectToCreate);
      const taskToCreate = new Task(
        "Task 1",
        "to-do",
        "2023-01-01",
        "2023-01-01"
      );
      taskToCreate.projectId = projectToCreate._id;
      const taskToCreate2 = new Task(
        "Task 2",
        "to-do",
        "2023-01-01",
        "2023-01-01"
      );
      taskToCreate2.projectId = projectToCreate._id;
      const taskToCreate3 = new Task(
        "Task 3",
        "to-do",
        "2023-01-01",
        "2023-01-01"
      );
      await getDb()
        .collection("tasks")
        .insertMany([taskToCreate, taskToCreate2, taskToCreate3]);
      const tasks = await ProjectController.getTasksByProjectName(
        projectToCreate.name
      );
      expect(tasks[0].projectId).toEqual(projectToCreate._id);
      expect(tasks[1].projectId).toEqual(projectToCreate._id);
      expect(tasks.length).toEqual(2);
    });
  });

  describe("getProjectsBySortDate", () => {
    it("should get all projects sorted by start date", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-03",
        "2023-01-01"
      );
      const projectToCreate2 = new Project(
        "Project 2",
        "2023-01-01",
        "2023-01-01"
      );
      const projectToCreate3 = new Project(
        "Project 3",
        "2023-01-02",
        "2023-01-01"
      );
      await getDb()
        .collection("projects")
        .insertMany([projectToCreate, projectToCreate2, projectToCreate3]);
      const projects = await ProjectController.getProjectsBySortDate(
        "startDate"
      );
      expect(projects[0].name).toEqual("Project 2");
      expect(projects[1].name).toEqual("Project 3");
      expect(projects[2].name).toEqual("Project 1");
    });
    it("should get all projects sorted by end date", async () => {
      const projectToCreate = new Project(
        "Project 1",
        "2023-01-01",
        "2023-01-03"
      );
      const projectToCreate2 = new Project(
        "Project 2",
        "2023-01-01",
        "2023-01-01"
      );
      const projectToCreate3 = new Project(
        "Project 3",
        "2023-01-01",
        "2023-01-02"
      );
      await getDb()
        .collection("projects")
        .insertMany([projectToCreate, projectToCreate2, projectToCreate3]);
      const projects = await ProjectController.getProjectsBySortDate("dueDate");
      expect(projects[0].name).toEqual("Project 2");
      expect(projects[1].name).toEqual("Project 3");
      expect(projects[2].name).toEqual("Project 1");
    });
  });
});
