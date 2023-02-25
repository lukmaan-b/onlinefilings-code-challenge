const TaskController = require("../controllers/taskController");

describe("taskController", () => {
  describe("createTask", () => {
    it("should create a new task", async () => {
      const task = await TaskController.createTask(
        "Test task",
        "To do",
        "2021-01-01",
        "2020-01-01"
      );
      expect(task).to.be.an("object");
      expect(task).to.have.property("_id");
      expect(task).to.have.property("name", "Test task");
      expect(task).to.have.property("status", "To do");
      expect(task).to.have.property("dueDate", "2021-01-01");
      expect(task).to.have.property("startDate", "2020-01-01");
    });
  });
  describe("getTasks", () => {});
  describe("updateTask", () => {});
  describe("deleteTask", () => {});
  describe("markTaskAsDone", () => {});
  describe("getTasksByStatus", () => {});
  describe("getTasksByName", () => {});
  describe("getTasksBySortDate", () => {});
});
