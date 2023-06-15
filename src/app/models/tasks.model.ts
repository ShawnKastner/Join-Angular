export class Task {
  title!: string;
  description!: string;
  category!: string;
  contacts!: string;
  dueDate!: Date;
  prio!: string;
  subtasks!: string;

  constructor(title: string, description: string, category: string, contacts: string, dueDate: Date, prio: string, subtasks: string) {
    this.title = title;
    this.description = description;
    this.category = category;
    this.contacts = contacts;
    this.dueDate = dueDate;
    this.prio = prio;
    this.subtasks = subtasks;
  }
}
