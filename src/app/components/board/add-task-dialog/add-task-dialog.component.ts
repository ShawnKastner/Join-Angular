import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ContactService } from 'src/app/shared/services/contact.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { NewCategoryDialogComponent } from '../../add-task/new-category-dialog/new-category-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskAddedToBoardComponent } from '../../add-task/task-added-to-board/task-added-to-board.component';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.scss'],
})
export class AddTaskDialogComponent {
  minDate!: Date;
  userId!: any;
  taskCategory!: string;
  durationInSeconds = 3;

  constructor(
    public taskService: TaskService,
    public contactService: ContactService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskCategory: string },
    private _snackBar: MatSnackBar,
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

  /**
   * The `addTask()` method is responsible for adding a new task to the task list. It calls the `addTask()` method from the
   * `taskService` to add the task to the Firestore database. After adding the task, it opens a snackbar notification by
   * calling the `openSnackBar()` method and then closes the dialog box by calling `dialogRef.close()`.
   * 
   * @method
   * @name addTask
   * @kind method
   * @memberof AddTaskDialogComponent
   * @returns {void}
   */
  addTask() {
    const taskCategory = this.taskCategory;
    this.taskService.addTask(taskCategory);
    this.openSnackBar();
    this.dialogRef.close();
  }

  /**
   * The `openSnackBar()` method is responsible for opening a snackbar notification. It uses the `_snackBar` service from
   * Angular Material to display a snackbar component (`TaskAddedToBoardComponent`) with a specified duration and panel
   * class.
   * 
   * @method
   * @name openSnackBar
   * @kind method
   * @memberof AddTaskDialogComponent
   * @returns {void}
   */
  openSnackBar() {
    this._snackBar.openFromComponent(TaskAddedToBoardComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: ['blue-snackbar'],
    });
  }
}
