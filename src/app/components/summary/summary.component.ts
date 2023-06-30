import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TaskService } from 'src/app/shared/services/task.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  displayName!: any;
  tasksInBoard!: number;
  tasksToDo!: number;
  tasksInProgress!: number;
  tasksAwaitingFeedback!: number;
  tasksDone!: number;
  urgentTasks!: number;
  nextDate: string = '';

  constructor(
    public authService: AuthService,
    public taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.displayName = this.authService.getUserData()?.displayName;
    this.updateTasksInBoardCount();
    this.updateTasksToDoCount();
    this.updateTasksInProgressCount();
    this.updateTasksAwaitingFeedbackCount();
    this.updateTasksDoneCount();
    this.updateUrgentTasksCount();
  }

  updateTasksInBoardCount() {
    this.tasksInBoard =
      this.taskService.allTasksToDo.length +
      this.taskService.allTasksInProgress.length +
      this.taskService.allTasksAwaitingFeedback.length +
      this.taskService.allTasksDone.length;
  }

  updateTasksToDoCount() {
    this.tasksToDo = this.taskService.allTasksToDo.length;
  }

  updateTasksInProgressCount() {
    this.tasksInProgress = this.taskService.allTasksInProgress.length;
  }

  updateTasksAwaitingFeedbackCount() {
    this.tasksAwaitingFeedback =
      this.taskService.allTasksAwaitingFeedback.length;
  }

  updateTasksDoneCount() {
    this.tasksDone = this.taskService.allTasksDone.length;
  }
  dates: any;

  updateUrgentTasksCount() {
    const allTasks = [
      ...this.taskService.allTasksToDo,
      ...this.taskService.allTasksInProgress,
      ...this.taskService.allTasksAwaitingFeedback,
      ...this.taskService.allTasksDone,
    ];

    const urgentTasks = allTasks.filter((task) => task.prio === 'urgent');
    this.urgentTasks = urgentTasks.length;
    this.dates = urgentTasks.map((task) => {
      const timestamp = task.dueDate;
      const date = timestamp.toDate();
      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };

      return date.toLocaleDateString(undefined, options);
    });
    this.getClosestDate();
  }

  getClosestDate() {
    const closestDate = this.dates.reduce(
      (closest: number | Date, date: string | number | Date) => {
        const targetDate = new Date(date);
        if (!closest || targetDate < closest) {
          closest = targetDate;
        }
        return closest;
      },
      undefined
    );
    if (closestDate) {
      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };
      this.nextDate = closestDate.toLocaleDateString('en-US', options);
    } else {
      this.nextDate = '';
    }
  }
}
