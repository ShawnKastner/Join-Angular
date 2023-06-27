import { Component, Inject, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/models/tasks.model';
import { ContactService } from 'src/app/shared/services/contact.service';
import { TaskService } from 'src/app/shared/services/task.service';

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
    public taskService: TaskService
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

  getContactInitials(contact: string): string {
    const nameParts = contact.split(' ');
    const initials = nameParts.map((namePart) => namePart.charAt(0));
    return initials.join('');
  }

  deleteSelectedTask() {
    this.taskService.deleteTask(this.task.taskId);
    this.dialogRef.close();
  }
}
