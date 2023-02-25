class Task {
  /**
   * checkRequiredFields
   * Check if all required fields are on the object.
   */
  checkRequiredFields() {
    if (!this.name || this.name.length === 0) {
      throw new Error("Name is required");
    }
    if (!this.status || this.status.length === 0) {
      throw new Error("Status is required");
    }
    if (!this.dueDate) {
      throw new Error("Due date is required");
    }
    if (!this.startDate) {
      throw new Error("Start date is required");
    }
  }

  /**
   * checkValidFields
   * Check if all fields are valid.
   */
  checkValidFelids() {
    if (this.status !== "to-do" && this.status !== "done") {
      throw new Error("Status is invalid");
    }
    if (this.dueDate < this.startDate) {
      throw new Error("Due date is earlier than start date");
    }
    if (this.startDate > this.dueDate) {
      throw new Error("Start date is later than due date");
    }
    if (this.startDate instanceof Date === false) {
      throw new Error("Start date is invalid");
    }
    if (this.dueDate instanceof Date === false) {
      throw new Error("Due date is invalid");
    }
  }
  constructor(name, status = "to-do", dueDate, startDate) {
    this.name = name;
    this.status = status;
    this.dueDate = dueDate ? new Date(dueDate) : new Date();
    this.startDate = startDate ? new Date(startDate) : new Date();
    this.checkRequiredFields();
    this.checkValidFelids();
  }
}

module.exports = Task;
