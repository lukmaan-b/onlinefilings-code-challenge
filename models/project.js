class Project {
  constructor(name,startDate,dueDate) {
    this.name = name;
    this.startDate = startDate ? new Date(startDate) : new Date();
    this.dueDate = dueDate ? new Date(dueDate) : new Date();
  }
}

module.exports = Project;