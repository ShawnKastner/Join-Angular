import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDialogComponent } from './new-category-dialog/new-category-dialog.component';
import { Observable } from 'rxjs';
import { AddTaskService } from 'src/app/shared/services/add-task.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskAddedToBoardComponent } from './task-added-to-board/task-added-to-board.component';
import { AddContactService } from 'src/app/shared/services/add-contact.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  minDate!: Date;

  userId!: any;
  durationInSeconds = 3;

  constructor(
    private dialog: MatDialog,
    public addTaskService: AddTaskService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public addContactService: AddContactService
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
    this.openSnackBar();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(TaskAddedToBoardComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: ['blue-snackbar'],
    });
  }
}
