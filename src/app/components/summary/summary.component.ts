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
    this.taskService.getUid().then(() => {
      this.taskService.getTasksToDo();
      this.taskService.getTasksInProgress();
      this.taskService.getTasksAwaitingFeedback();
      this.taskService.getTasksDone();
      this.allTasksCount();
    });
    this.getCurrentTime();
  }

  /**
   * The `allTasksCount()` method is responsible for calculating the total number of tasks and the number of urgent tasks.
   * 
   * @method
   * @name allTasksCount
   * @kind method
   * @memberof SummaryComponent
   * @returns {void}
   */
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

  /**
   * The `updateUrgentTasksCount()` method is responsible for updating the count of urgent tasks. It takes in four arrays of
   * tasks (`tasksToDo`, `tasksInProgress`, `tasksAwaitingFeedback`, `tasksDone`) and combines them into a single array
   * called `allTasks`. It then filters the `allTasks` array to find all tasks with a priority of "urgent" and assigns the
   * length of this filtered array to the `urgentTasks` variable.
   * 
   * @method
   * @name updateUrgentTasksCount
   * @kind method
   * @memberof SummaryComponent
   * @param {any[]} tasksToDo
   * @param {any[]} tasksInProgress
   * @param {any[]} tasksAwaitingFeedback
   * @param {any[]} tasksDone
   * @returns {void}
   */
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

  /**
   * The `getClosestDate()` method is responsible for finding the closest date among the array of dates stored in the `dates`
   * variable. It uses the `reduce()` function to iterate over the `dates` array and compare each date to the current closest
   * date. If a date is found that is closer than the current closest date, it is assigned as the new closest date. Finally,
   * the closest date is formatted using the `toLocaleDateString()` method and assigned to the `nextDate` variable.
   * 
   * @method
   * @name getClosestDate
   * @kind method
   * @memberof SummaryComponent
   * @returns {void}
   */
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

  /**
   * The `getCurrentTime()` method is responsible for getting the current time and setting the `currentTime` variable based
   * on the time of day. It uses the `getHours()` method of the `Date` object to get the current hour. Then, it uses
   * conditional (ternary) operators to determine whether it is morning, afternoon, or evening based on the value of
   * `this.hour`. The resulting string is assigned to the `currentTime` variable, which can be used in the template to
   * display a greeting message.
   * 
   * @method
   * @name getCurrentTime
   * @kind method
   * @memberof SummaryComponent
   * @returns {void}
   */
  getCurrentTime() {
    this.currentTime =
      'Good ' +
      ((this.hour < 12 && 'Morning') ||
        (this.hour < 18 && 'Afternoon') ||
        'Evening');
  }
}
