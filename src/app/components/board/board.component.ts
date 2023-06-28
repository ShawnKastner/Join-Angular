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
  allTasksInProgress$!: Observable<any>;
  allTasksAwaitingFeedback$!: Observable<any>;
  allTasksDone$!: Observable<any>;
  selectedTask: any;

  constructor(
    private dialog: MatDialog,
    private firestore: Firestore,
    public taskService: TaskService
  ) {}

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
    this.allTasksToDo$.subscribe();
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
    this.allTasksInProgress$.subscribe();
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
    this.allTasksAwaitingFeedback$.subscribe();
  }
  getTasksDone() {
    this.allTasksDone$ = collectionData(
      collection(this.firestore, 'users', this.taskService.userId, 'tasksDone')
    );
    this.allTasksDone$.subscribe();
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

  onTaskDrop(event: CdkDragDrop<Task[]>, category: string) {
    //   if (event.previousContainer === event.container) {
    //     // Innerhalb des gleichen Containers verschoben
    //     moveItemInArray(
    //       event.container.data,
    //       event.previousIndex,
    //       event.currentIndex
    //     );
    //   } else {
    //     // Zwischen Containern verschoben
    //     transferArrayItem(
    //       event.previousContainer.data,
    //       event.container.data,
    //       event.previousIndex,
    //       event.currentIndex
    //     );
    //     // Aktualisiere die Kategorie der Aufgabe
    //     const task = event.container.data[event.currentIndex];
    //     task.category = category;
    //     // Speichere die Aktualisierung im Firestore oder in der entsprechenden Collection
    //     this.taskService.updateTaskCategoryInFirestore(task);
    //   }
  }
}
