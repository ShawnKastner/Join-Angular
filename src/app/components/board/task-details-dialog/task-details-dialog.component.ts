import { Component, Inject, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/models/tasks.model';
import { ContactService } from 'src/app/shared/services/contact.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { EditTaskDialogComponent } from './edit-task-dialog/edit-task-dialog.component';

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.scss'],
})
export class TaskDetailsDialogComponent implements OnInit {
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TaskDetailsDialogComponent>,
    public contactService: ContactService,
    public taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.contactService.getUid().then(() => {
      this.contactService.getContactsFromFirestore();
    });
    this.formattedDate();
  }

  formattedDate() {
    const dueDateTimestamp: Timestamp = this.data.task.dueDate;
    const dueDate = dueDateTimestamp.toDate();
    const day = String(dueDate.getDate()).padStart(2, '0');
    const month = String(dueDate.getMonth() + 1).padStart(2, '0');
    const year = dueDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    this.task = {
      ...this.data.task,
      dueDate: formattedDate,
    };
  }

  deleteSelectedTask() {
    this.taskService.deleteTask(this.task.taskId);
    this.dialogRef.close();
  }

  closeDetailsDialog() {
    this.dialogRef.close();
  }

  openEditTaskDialog() {
    this.dialog.open(EditTaskDialogComponent, {
      width: '623px',
      height: '824px',
      data: { task: this.task },
    })
    this.dialogRef.close();
  }
}
