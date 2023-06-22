import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  constructor(private dialog: MatDialog) {}

  openAddTaskDialog() {
    this.dialog.open(AddTaskDialogComponent, {
      width: '1116px',
      height: '914px',
    });
  }
}
