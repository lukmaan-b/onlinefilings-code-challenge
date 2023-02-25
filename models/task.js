class Task {
    constructor(name,status="to-do",dueDate,startDate) {
      this.name = name;
      this.status = status;
      this.dueDate = dueDate ? new Date(dueDate) : new Date();
      this.startDate = startDate ? new Date(startDate) : new Date();
    }
}

module.exports = Task;