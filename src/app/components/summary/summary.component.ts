import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TaskService } from 'src/app/shared/services/task.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  displayName!: any;
  allTasks$!: Observable<any[]>;
  totalTasksCount!: number;
  urgentTasks!: number;
  dates: any;
  nextDate: string = '';
  hour = new Date().getHours();
  currentTime = '';

  constructor(
    public authService: AuthService,
    public taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.displayName = this.authService.getUserData()?.displayName;
    this.taskService.getUid().then(() => {
      this.taskService.getTasksToDo();
      this.taskService.getTasksInProgress();
      this.taskService.getTasksAwaitingFeedback();
      this.taskService.getTasksDone();
      this.allTasksCount();
    });
    this.getCurrentTime();
  }

  allTasksCount() {
    this.allTasks$ = combineLatest([
      this.taskService.allTasksToDo$,
      this.taskService.allTasksInProgress$,
      this.taskService.allTasksAwaitingFeedback$,
      this.taskService.allTasksDone$,
    ]);
    this.allTasks$.subscribe(
      ([tasksToDo, tasksInProgress, tasksAwaitingFeedback, tasksDone]) => {
        this.totalTasksCount =
          tasksToDo.length +
          tasksInProgress.length +
          tasksAwaitingFeedback.length +
          tasksDone.length;
        this.updateUrgentTasksCount(
          tasksToDo,
          tasksInProgress,
          tasksAwaitingFeedback,
          tasksDone
        );
      }
    );
  }

  updateUrgentTasksCount(
    tasksToDo: any[],
    tasksInProgress: any[],
    tasksAwaitingFeedback: any[],
    tasksDone: any[]
  ) {
    const allTasks = [
      ...tasksToDo,
      ...tasksInProgress,
      ...tasksAwaitingFeedback,
      ...tasksDone,
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

  getCurrentTime() {
    this.currentTime =
      'Good ' +
      ((this.hour < 12 && 'Morning') ||
        (this.hour < 18 && 'Afternoon') ||
        'Evening');
  }
}
