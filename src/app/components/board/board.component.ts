import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AddTaskService } from 'src/app/shared/services/add-task.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  allTasks$!: Observable<any>;
  userId!: any;

  constructor(
    private dialog: MatDialog,
    private firestore: Firestore,
    private authService: AuthService,
    public addTaskService: AddTaskService
  ) {}

  ngOnInit() {
    this.getUid().then(() => {
      this.getTasks();
    });
  }

  openAddTaskDialog() {
    this.dialog.open(AddTaskDialogComponent, {
      width: '1116px',
      height: '914px',
    });
  }

  getTasks() {
    this.allTasks$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'tasks')
    );
    this.allTasks$.subscribe((data) => {
      console.log('Tasks:', data);
    });
  }

  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }
}
