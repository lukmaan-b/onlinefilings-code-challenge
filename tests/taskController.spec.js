const TaskController = require("../controllers/taskController");
const { connectDb, clearTasks, closeConnection, getDb } = require("../db/db");
const Task = require("../models/task");

describe("taskController", () => {
  beforeAll(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await clearTasks();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe("checkTaskExist", () => {
    it("should return true if task exist", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      const taskExist = await TaskController.checkTaskExist(taskToCreate._id);
      expect(taskExist).toBe(true);
    });
    it("should return false if task does not exist", async () => {
      const taskExist = await TaskController.checkTaskExist("invalidId");
      expect(taskExist).toBe(false);
    });
  });

  describe("throwErrorIfTaskNotExist", () => {
    it("should throw an error if task does not exist", async () => {
      expect(
        TaskController.throwErrorIfTaskNotExist("invalidId")
      ).rejects.toThrow("Task not found");
    });
  });

  describe("createTask", () => {
    it("should create a new task", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      const task = await TaskController.createTask(
        taskToCreate.name,
        taskToCreate.status,
        taskToCreate.dueDate,
        taskToCreate.startDate
      );
      expect(task).toEqual(expect.objectContaining(taskToCreate));
    });
  });

  describe("getTasks", () => {
    it("should get all tasks", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      const taskToCreate2 = new Task(
        "Test task 2",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      await getDb().collection("tasks").insertMany([taskToCreate, taskToCreate2]);
      const tasks = await TaskController.getTasks();
      expect(tasks.length).toBe(2);
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      const taskToUpdate = new Task(
        "Test task updated",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      const updatedTask = await TaskController.updateTask(
        taskToCreate._id,
        taskToUpdate.name
      );
      expect(updatedTask).toEqual(expect.objectContaining(taskToUpdate));
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await TaskController.deleteTask(taskToCreate._id);
      expect(
        getDb().collection("tasks").findOne({ _id: taskToCreate._id })
      ).resolves.toBe(null);
    });
  });

  describe("toggleTaskCompletion", () => {
    it("should mark a task as done", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await TaskController.toggleTaskCompletion(taskToCreate._id);
      let updatedTaskInDb = await getDb()
        .collection("tasks")
        .findOne({ _id: taskToCreate._id });
      expect(updatedTaskInDb.status).toBe("done");
      await TaskController.toggleTaskCompletion(taskToCreate._id);
      updatedTaskInDb = await getDb()
        .collection("tasks")
        .findOne({ _id: taskToCreate._id });
      expect(updatedTaskInDb.status).toBe("to-do");
    });
    it("should reset start date to today's date when marking a task as to-do", async () => {
      const taskToCreate = new Task(
        "Test task",
        "done",
        "2023-03-01",
        "2023-02-02"
      );
      const todayDate = new Date();
      await getDb().collection("tasks").insertOne(taskToCreate);
      await TaskController.toggleTaskCompletion(taskToCreate._id);
      const updatedTaskInDb = await getDb()
        .collection("tasks")
        .findOne({ _id: taskToCreate._id });
      expect(updatedTaskInDb.status).toBe("to-do");
      expect(updatedTaskInDb.startDate.getFullYear()).toBe(
        todayDate.getFullYear()
      );
      expect(updatedTaskInDb.startDate.getMonth()).toBe(todayDate.getMonth());
      expect(updatedTaskInDb.startDate.getDate()).toBe(todayDate.getDate());
    });
    it("should set done date when marking a task as done", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      const todayDate = new Date();
      await getDb().collection("tasks").insertOne(taskToCreate);
      await TaskController.toggleTaskCompletion(taskToCreate._id);
      const updatedTaskInDb = await getDb()
        .collection("tasks")
        .findOne({ _id: taskToCreate._id });
      expect(updatedTaskInDb.status).toBe("done");
      expect(updatedTaskInDb.doneDate.getFullYear()).toBe(
        todayDate.getFullYear()
      );
      expect(updatedTaskInDb.doneDate.getMonth()).toBe(todayDate.getMonth());
      expect(updatedTaskInDb.doneDate.getDate()).toBe(todayDate.getDate());
    });
  });

  describe("getTasksByStatus", () => {
    it("should get all tasks by status", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      const taskToCreate2 = new Task(
        "Test task 2",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      const taskToCreate3 = new Task(
        "Test task 3",
        "done",
        "2023-03-01",
        "2023-02-02"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await getDb().collection("tasks").insertOne(taskToCreate2);
      await getDb().collection("tasks").insertOne(taskToCreate3);
      const tasks = await TaskController.getTasksByStatus("to-do");
      expect(tasks.length).toBe(2);
    });
  });

  describe("getTasksByName", () => {
    it("should get all tasks by name", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      const taskToCreate2 = new Task(
        "Test task 2",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      const taskToCreate3 = new Task(
        "Task",
        "done",
        "2023-03-01",
        "2023-02-02"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await getDb().collection("tasks").insertOne(taskToCreate2);
      await getDb().collection("tasks").insertOne(taskToCreate3);
      const tasks = await TaskController.getTasksByName("Test task");
      expect(tasks.length).toBe(2);
    });
  });
  
  describe("getTasksBySortDate", () => {
    it("should get all tasks by start date", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-03"
      );
      const taskToCreate2 = new Task(
        "Test task 2",
        "to-do",
        "2023-03-01",
        "2023-02-01"
      );
      const taskToCreate3 = new Task(
        "Test",
        "done",
        "2023-03-01",
        "2023-02-02"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await getDb().collection("tasks").insertOne(taskToCreate2);
      await getDb().collection("tasks").insertOne(taskToCreate3);
      const tasks = await TaskController.getTasksBySortDate("startDate");
      expect(tasks[0].name).toBe("Test task 2");
      expect(tasks[1].name).toBe("Test");
      expect(tasks[2].name).toBe("Test task");
    });
    it("should get all tasks by done date", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      )
      taskToCreate.doneDate = new Date("2023-01-03");
      const taskToCreate2 = new Task(
        "Test task 2",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      taskToCreate2.doneDate = new Date("2023-01-01");
      const taskToCreate3 = new Task(
        "Test",
        "done",
        "2023-03-01",
        "2023-02-02"
      );
      taskToCreate3.doneDate = new Date("2023-01-02");
      await getDb().collection("tasks").insertOne(taskToCreate);
      await getDb().collection("tasks").insertOne(taskToCreate2);
      await getDb().collection("tasks").insertOne(taskToCreate3);
      const tasks = await TaskController.getTasksBySortDate("doneDate");
      expect(tasks[0].name).toBe("Test task 2");
      expect(tasks[1].name).toBe("Test");
      expect(tasks[2].name).toBe("Test task");
    });
    it("should get all tasks by due date", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-03",
        "2023-02-02"
      );
      const taskToCreate2 = new Task(
        "Test task 2",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      const taskToCreate3 = new Task(
        "Test",
        "done",
        "2023-03-02",
        "2023-02-02"
      );
      await getDb().collection("tasks").insertOne(taskToCreate);
      await getDb().collection("tasks").insertOne(taskToCreate2);
      await getDb().collection("tasks").insertOne(taskToCreate3);
      const tasks = await TaskController.getTasksBySortDate("dueDate");
      expect(tasks[0].name).toBe("Test task 2");
      expect(tasks[1].name).toBe("Test");
      expect(tasks[2].name).toBe("Test task");
    });
    it("should only return tasks with done date if sort type is doneDate", async () => {
      const taskToCreate = new Task(
        "Test task",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      )
      const taskToCreate2 = new Task(
        "Test task 2",
        "to-do",
        "2023-03-01",
        "2023-02-02"
      );
      taskToCreate2.doneDate = new Date("2023-01-01");
      const taskToCreate3 = new Task(
        "Test",
        "done",
        "2023-03-01",
        "2023-02-02"
      );
      taskToCreate3.doneDate = new Date("2023-01-02");
      await getDb().collection("tasks").insertOne(taskToCreate);
      await getDb().collection("tasks").insertOne(taskToCreate2);
      await getDb().collection("tasks").insertOne(taskToCreate3);
      const tasks = await TaskController.getTasksBySortDate("doneDate");
      expect(tasks[0].name).toBe("Test task 2");
      expect(tasks[1].name).toBe("Test");
      expect(tasks.length).toBe(2);
    });
  });
});
