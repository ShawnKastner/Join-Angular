import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddContactService } from 'src/app/shared/services/add-contact.service';
import { AddTaskService } from 'src/app/shared/services/add-task.service';
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

  constructor(
    public addTaskService: AddTaskService,
    public addContactService: AddContactService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddTaskDialogComponent>
  ) {
    this.minDate = new Date();
  }

  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }

  ngOnInit(): void {
    this.getUid().then(() => {
      this.addTaskService.getCategoriesFromFirestore();
      this.addTaskService.getSubtasksFromFirestore();
      this.addContactService.getContactsFromFirestore();
    });
  }

  openAddCategoryDialog() {
    this.dialog.open(NewCategoryDialogComponent, {
      width: '250px',
    });
  }

  addTask() {
    this.addTaskService.addTask();
    this.dialogRef.close();
  }
}
