import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDialogComponent } from './new-category-dialog/new-category-dialog.component';
import { Observable } from 'rxjs';
import { TaskService } from 'src/app/shared/services/task.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskAddedToBoardComponent } from './task-added-to-board/task-added-to-board.component';
import { ContactService } from 'src/app/shared/services/contact.service';
import { Router } from '@angular/router';

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
    public taskService: TaskService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public contactService: ContactService,
  ) {
    this.minDate = new Date();
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
      width: '300px',
    });
  }

  addTask() {
    this.taskService.addTask('To Do');
    this.openSnackBar();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(TaskAddedToBoardComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: ['blue-snackbar'],
    });
  }
}
