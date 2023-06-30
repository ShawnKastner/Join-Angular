import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { TaskDetailsDialogComponent } from './task-details-dialog/task-details-dialog.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task } from 'src/app/models/tasks.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  allTasksToDo$!: Observable<any>;
  allTasksToDo!: any;
  allTasksInProgress$!: Observable<any>;
  allTasksInProgress!: any;
  allTasksAwaitingFeedback$!: Observable<any>;
  allTasksAwaitingFeedback!: any;
  allTasksDone$!: Observable<any>;
  allTasksDone!: any;
  selectedTask: any;
  currentCollectionNameToDo: string;
  currentCollectionNameInProgress: string;
  currentCollectionNameAwaitingFeedback: string;
  currentCollectionNameDone: string;

  constructor(
    private dialog: MatDialog,
    private firestore: Firestore,
    public taskService: TaskService
  ) {
    this.currentCollectionNameToDo = 'To Do';
    this.currentCollectionNameInProgress = 'In Progress';
    this.currentCollectionNameAwaitingFeedback = 'Awaiting Feedback';
    this.currentCollectionNameDone = 'Done';
  }

  ngOnInit() {
    this.taskService.getUid().then(() => {
      this.getTasksToDo();
      this.getTasksInProgress();
      this.getTasksAwaitingFeedback();
      this.getTasksDone();
    });
  }

  openAddTaskDialog(taskCategory: string) {
    this.dialog.open(AddTaskDialogComponent, {
      width: '1116px',
      height: '914px',
      data: { taskCategory: taskCategory },
    });
  }

  getTasksToDo() {
    this.allTasksToDo$ = collectionData(
      collection(this.firestore, 'users', this.taskService.userId, 'tasksToDo')
    );
    this.allTasksToDo$.subscribe((data) => {
      this.allTasksToDo = data;
    });
  }

  getTasksInProgress() {
    this.allTasksInProgress$ = collectionData(
      collection(
        this.firestore,
        'users',
        this.taskService.userId,
        'tasksInProgress'
      )
    );
    this.allTasksInProgress$.subscribe((data) => {
      this.allTasksInProgress = data;
    });
  }
  getTasksAwaitingFeedback() {
    this.allTasksAwaitingFeedback$ = collectionData(
      collection(
        this.firestore,
        'users',
        this.taskService.userId,
        'tasksAwaitingFeedback'
      )
    );
    this.allTasksAwaitingFeedback$.subscribe((data) => {
      this.allTasksAwaitingFeedback = data;
    });
  }
  getTasksDone() {
    this.allTasksDone$ = collectionData(
      collection(this.firestore, 'users', this.taskService.userId, 'tasksDone')
    );
    this.allTasksDone$.subscribe((data) => (this.allTasksDone = data));
  }

  openTaskDetails(task: any, taskCategory: string) {
    this.selectedTask = task;
    this.dialog.open(TaskDetailsDialogComponent, {
      width: '623px',
      height: '824px',
      data: { task: this.selectedTask, taskCategory: taskCategory },
    });
    console.log(this.selectedTask);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, taskCategory: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const taskId = task.taskId;
      const previousCollectionName =
        event.previousContainer?.element.nativeElement.getAttribute(
          'currentCollection'
        );
      console.log('Task categories are:', taskCategory, previousCollectionName);

      if (previousCollectionName) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        this.taskService.updateTaskCategoryInFirestore(
          taskCategory,
          taskId,
          previousCollectionName
        );
      } else {
        console.error('Invalid currentCollectionName');
      }
    }
  }
}
