import { Component, Inject, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
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
  taskCategory!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public category: { taskCategory: string },
    private dialogRef: MatDialogRef<TaskDetailsDialogComponent>,
    public contactService: ContactService,
    public taskService: TaskService,
    private dialog: MatDialog
  ) {
    this.taskCategory = data.taskCategory;
  }

  ngOnInit(): void {
    this.contactService.getUid().then(() => {
      this.contactService.getContactsFromFirestore();
    });
    this.formattedDate();
  }

  /**
   * The `formattedDate()` method is used to format the due date of the task. It takes the due date timestamp from the
   * `data.task` object and converts it to a JavaScript `Date` object. Then, it extracts the day, month, and year from the
   * `Date` object and formats them as a string in the format "dd-mm-yyyy". Finally, it updates the `dueDate` property of the
   * `task` object with the formatted date.
   * 
   * @method
   * @name formattedDate
   * @kind method
   * @memberof TaskDetailsDialogComponent
   * @returns {void}
   */
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
    const taskCategory = this.taskCategory;
    this.taskService.deleteTask(this.task.taskId, taskCategory);
    this.dialogRef.close();
  }

  closeDetailsDialog() {
    this.dialogRef.close();
  }

  /**
   * The `openEditTaskDialog()` method is used to open the `EditTaskDialogComponent` dialog. It uses the `MatDialog` service
   * to open the dialog and passes the necessary data to the dialog using the `data` property of the `MatDialogConfig`
   * object. The `task` and `taskCategory` properties of the current component's `task` object are passed as data to the
   * dialog. After opening the dialog, the current dialog is closed using the `dialogRef.close()` method.
   * 
   * @method
   * @name openEditTaskDialog
   * @kind method
   * @memberof TaskDetailsDialogComponent
   * @returns {void}
   */
  openEditTaskDialog() {
    this.dialog.open(EditTaskDialogComponent, {
      width: '623px',
      height: '824px',
      data: { task: this.task, taskCategory: this.taskCategory },
    });
    this.dialogRef.close();
  }
}
