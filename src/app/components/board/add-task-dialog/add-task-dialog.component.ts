import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ContactService } from 'src/app/shared/services/contact.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { NewCategoryDialogComponent } from '../../add-task/new-category-dialog/new-category-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.scss'],
})
export class AddTaskDialogComponent {
  minDate!: Date;
  userId!: any;
  taskCategory!: string;

  constructor(
    public taskService: TaskService,
    public contactService: ContactService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskCategory: string }
  ) {
    this.minDate = new Date();
    this.taskCategory = data.taskCategory;
  }

  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }

  ngOnInit(): void {
    this.getUid().then(() => {
      this.taskService.getCategoriesFromFirestore();
      this.taskService.getSubtasksFromFirestore();
      this.contactService.getContactsFromFirestore();
    });
  }

  openAddCategoryDialog() {
    this.dialog.open(NewCategoryDialogComponent, {
      width: '250px',
    });
  }

  addTask() {
    const taskCategory = this.taskCategory;
    this.taskService.addTask(taskCategory);
    this.dialogRef.close();
  }
}
