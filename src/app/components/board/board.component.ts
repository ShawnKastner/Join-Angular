import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
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
  selectedTask: any;
  currentCollectionNameToDo: string;
  currentCollectionNameInProgress: string;
  currentCollectionNameAwaitingFeedback: string;
  currentCollectionNameDone: string;
  searchValue: string = '';

  constructor(private dialog: MatDialog, public taskService: TaskService) {
    this.currentCollectionNameToDo = 'To Do';
    this.currentCollectionNameInProgress = 'In Progress';
    this.currentCollectionNameAwaitingFeedback = 'Awaiting Feedback';
    this.currentCollectionNameDone = 'Done';
  }

  ngOnInit() {
    this.taskService.getUid().then(() => {
      this.taskService.getTasksToDo();
      this.taskService.getTasksInProgress();
      this.taskService.getTasksAwaitingFeedback();
      this.taskService.getTasksDone();
    });
  }

  openAddTaskDialog(taskCategory: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass= ['dialog-media-height', 'slide-in-dialog', 'add-task-dialog-width']
    this.dialog.open(AddTaskDialogComponent, {
      ...dialogConfig,
      data: { taskCategory: taskCategory },
    });
  }

  openTaskDetails(task: any, taskCategory: string) {
    this.selectedTask = task;
    this.dialog.open(TaskDetailsDialogComponent, {
      width: '623px',
      height: '824px',
      data: { task: this.selectedTask, taskCategory: taskCategory },
    });
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
