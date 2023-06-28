import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/models/tasks.model';
import { ContactService } from 'src/app/shared/services/contact.service';
import { TaskService } from 'src/app/shared/services/task.service';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.scss'],
})
export class EditTaskDialogComponent implements OnInit {
  task: Task = new Task(
    this.data.task.title,
    this.data.task.description,
    this.data.task.category,
    this.data.task.contacts,
    this.data.task.dueDate,
    this.data.task.prio,
    this.data.task.subtasks,
    this.data.task.categoryColor,
    this.data.task.taskId
  );
  minDate!: Date;
  taskCategory!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public category: { taskCategory: string },
    public taskService: TaskService,
    public contactService: ContactService,
    private dialogRef: MatDialogRef<EditTaskDialogComponent>
  ) {
    this.minDate = new Date();
    this.taskCategory = data.taskCategory;
  }

  ngOnInit() {}

  closeEditDialog() {
    this.dialogRef.close();
  }

  editTask() {
    const taskCategory = this.taskCategory;
    this.taskService.editTask(this.data.task.taskId, this.task, taskCategory);
    this.closeEditDialog();
  }
}
