import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Task } from 'src/app/models/tasks.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  title!: string;
  description!: string;
  category!: string;
  selectedContact!: string;
  date!: string;
  selectedPriority!: string;
  subtask!: string;
  selectedSubtasks: { [key: string]: boolean } = {};
  isAddingSubtask = false;
  userId!: any;
  categories$!: Observable<any[]>;
  categories: any[] = [];
  subtasks$!: Observable<any[]>;
  subtasks: any[] = [];
  checkedSubtasks: { [taskId: string]: { [subtask: string]: number } } = {};
  allTasksToDo$!: Observable<any>;
  allTasksToDo: any[] = [];
  allTasksInProgress$!: Observable<any>;
  allTasksInProgress: any[] = [];
  allTasksAwaitingFeedback$!: Observable<any>;
  allTasksAwaitingFeedback: any[] = [];
  allTasksDone$!: Observable<any>;
  allTasksDone: any[] = [];

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private afs: AngularFirestore
  ) {
    this.getUid();
    this.loadCheckedSubtasks();
  }


  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }

  /**
   * The `addTask(taskCategory: string)` method is used to add a new task to the Firestore database. It takes a
   * `taskCategory` parameter, which represents the category of the task (e.g., "To Do", "In Progress", "Awaiting Feedback",
   * "Done").
   * 
   * @method
   * @name addTask
   * @kind method
   * @memberof TaskService
   * @param {string} taskCategory
   * @returns {void}
   */
  addTask(taskCategory: string) {
    const collectionRef = collection(
      this.firestore,
      'users',
      this.userId,
      this.getCategoryCollectionName(taskCategory)
    );
    const categoryColor = this.getCategoryColor(this.category);
    const taskId = this.afs.createId();
    const taskDocRef = doc(collectionRef, taskId);
    const newTask = new Task(
      this.title,
      this.description,
      this.category,
      this.selectedContact,
      new Date(this.date),
      this.selectedPriority,
      this.getSelectedSubtasks(),
      categoryColor,
      taskId
    );
    setDoc(taskDocRef, { ...newTask, taskId: taskId })
      .then(() => {
        this.clearInput();
      })
      .catch((error) => {
        console.error('Add task was failed:', error);
      });
  }

  /**
   * The `getCategoryCollectionName(taskCategory: string): string` function is used to determine the name of the Firestore
   * collection based on the task category. It takes a `taskCategory` parameter, which represents the category of the task
   * (e.g., "To Do", "In Progress", "Awaiting Feedback", "Done").
   * 
   * @method
   * @name getCategoryCollectionName
   * @kind method
   * @memberof TaskService
   * @param {string} taskCategory
   * @returns {string}
   */
  getCategoryCollectionName(taskCategory: string): string {
    // Funktion, um den Namen der Kategorie-basierten Collection basierend auf der übergebenen Kategorie zu erhalten
    if (taskCategory === 'In Progress') {
      return 'tasksInProgress';
    } else if (taskCategory === 'To Do') {
      return 'tasksToDo';
    } else if (taskCategory === 'Awaiting Feedback') {
      return 'tasksAwaitingFeedback';
    } else if (taskCategory === 'Done') {
      return 'tasksDone';
    } else {
      return '';
    }
  }

  /**
   * The above code is defining an asynchronous function called "updateTaskCategoryInFirestore".
   * 
   * @async
   * @method
   * @name updateTaskCategoryInFirestore
   * @kind method
   * @memberof TaskService
   * @param {string} taskCategory
   * @param {string} taskId
   * @param {string} currentCollectionName
   * @returns {Promise<void>}
   */
  async updateTaskCategoryInFirestore(
    taskCategory: string,
    taskId: string,
    currentCollectionName: string
  ) {
    const newCollectionName = this.getCategoryCollectionName(taskCategory);
    const currentCollection = this.getCategoryCollectionName(
      currentCollectionName
    );
    if (currentCollection === newCollectionName) {
      // Keine Änderung erforderlich, da der Task bereits in der gewünschten Kategorie ist
      return;
    }
    const oldCollectionRef = collection(
      this.firestore,
      'users',
      this.userId,
      currentCollection
    );

    const newCollectionRef = collection(
      this.firestore,
      'users',
      this.userId,
      newCollectionName
    );
    const taskDocRef = doc(oldCollectionRef, taskId);
    const taskDocSnapshot = await getDoc(taskDocRef);
    if (taskDocSnapshot.exists()) {
      const taskData = taskDocSnapshot.data();
      if (taskData) {
        const newTaskDocRef = doc(newCollectionRef, taskId);
        await setDoc(newTaskDocRef, taskData);
        await deleteDoc(taskDocRef);
        // console.log('Task successfully moved to', newCollectionName);
      }
    }
  }

  startAddingSubtask() {
    this.isAddingSubtask = true;
  }

  confirmSubtask() {
    this.isAddingSubtask = false;
    this.addSubtask();
  }

  cancelSubtask() {
    this.isAddingSubtask = false;
    this.subtask = '';
  }

  /**
   * This function add a subtask to the firebase database
   * 
   * @method
   * @name addSubtask
   * @kind method
   * @memberof TaskService
   * @returns {void}
   */
  addSubtask() {
    const subTaskCollection = collection(
      this.firestore,
      'users',
      this.userId,
      'subtasks'
    );
    addDoc(subTaskCollection, {
      subtask: this.subtask,
    }).then(() => {
      this.subtask = '';
    });
  }

  /**
   *
   * @returns the selected subtasks from checkbox
   */
  getSelectedSubtasks(): string[] {
    return Object.keys(this.selectedSubtasks).filter(
      (key) => this.selectedSubtasks[key]
    );
  }

  clearInput() {
    this.title = '';
    this.description = '';
    this.category = '';
    this.selectedContact = '';
    this.date = '';
    this.selectedPriority = '';
    this.subtask = '';
    this.selectedSubtasks = {};
  }

  /**
   * Function to delete all subtasks from the subtasks collection
   */
  async deleteAllSubtasks() {
    const subTaskCollectionRef = collection(
      this.firestore,
      'users',
      this.userId,
      'subtasks'
    );
    const querySnapshot = await getDocs(subTaskCollectionRef);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  /**
   * The above code is defining a function called "getSubtasksFromFirestore" which is likely used to retrieve subtasks from a
   * Firestore database. However, the code provided is incomplete and the actual implementation of the function is missing.
   * 
   * @method
   * @name getSubtasksFromFirestore
   * @kind method
   * @memberof TaskService
   * @returns {void}
   */
  getSubtasksFromFirestore() {
    this.subtasks$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'subtasks')
    );
    this.subtasks$.subscribe((data) => {
      this.subtasks = data;
    });
  }

  /**
   * get categories from the categories collection
   */
  getCategoriesFromFirestore() {
    this.categories$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'categories')
    );
    this.categories$.subscribe((data) => {
      this.categories = data;

    });
  }

  /** Get color from the category
   *
   * @param category get the current category
   * @returns the right color from the category
   */
  getCategoryColor(category: string): string {
    const selectedCategory = this.categories.find(
      (item) => item.name === category
    );
    return selectedCategory ? selectedCategory.color : '';
  }

  /**
   *
   * @param category category name
   * @returns the selected category name
   */
  getCategoryName(category: string): string {
    const selectedCategory = this.categories.find(
      (item) => item.name === category
    );
    return selectedCategory ? selectedCategory.name : '';
  }

  /**
   *
   * @param taskId get the current task id
   * @param taskCategory get the current task category
   */
  async updateCheckedSubtasksInFirestore(taskId: string, taskCategory: string) {
    const taskRef = doc(
      this.firestore,
      'users',
      this.userId,
      this.getCategoryCollectionName(taskCategory),
      taskId
    );

    const checkedSubtasksCount = this.getTotalSubtaskCount(taskId);

    await updateDoc(taskRef, {
      checkedSubtasks: checkedSubtasksCount,
    });
  }

  /** function to check which subtasks who checked and saved in local storage
   *
   * @param subtask get subtasks
   * @param isChecked get subtasks who checked
   * @param taskId get current task id
   * @param taskCategory get current task category
   */
  checkedSubtask(
    subtask: string,
    isChecked: boolean,
    taskId: string,
    taskCategory: string
  ) {
    // Update the checked status
    this.checkedSubtasks[taskId] = {
      ...this.checkedSubtasks[taskId],
      [subtask]: isChecked ? 1 : 0,
    };

    this.updateCheckedSubtasksInFirestore(taskId, taskCategory); // Update checkedSubtasks in Firestore
    localStorage.setItem(
      'checkedSubtasks',
      JSON.stringify(this.checkedSubtasks)
    );
  }

  /**
   * load checked subtasks from local storage
   */
  loadCheckedSubtasks() {
    const savedCheckedSubtasks = localStorage.getItem('checkedSubtasks');
    if (savedCheckedSubtasks) {
      this.checkedSubtasks = JSON.parse(savedCheckedSubtasks);
    }
  }

  /**
   *
   * @param taskId get current task id
   * @returns how many subtasks who checked
   */
  getTotalSubtaskCount(taskId: string): number {
    const checkedSubtasks = this.checkedSubtasks[taskId];
    if (checkedSubtasks) {
      return Object.values(checkedSubtasks).reduce(
        (sum, value) => sum + value,
        0
      );
    } else {
      return 0;
    }
  }

  /**delete selected task from the task collection
   *
   * @param taskId current task id
   * @param taskCategory current task category
   */
  async deleteTask(taskId: string, taskCategory: string) {
    const taskRef = doc(
      this.firestore,
      'users',
      this.userId,
      this.getCategoryCollectionName(taskCategory),
      taskId
    );
    await deleteDoc(taskRef);
  }

  /** edit task in the task collection
   *
   * @param taskId current task id
   * @param task current task
   * @param taskCategory current task category
   * @returns edited task
   */
  editTask(taskId: string, task: Task, taskCategory: string): Promise<void> {
    const taskDocRef = doc(
      this.firestore,
      'users',
      this.userId,
      this.getCategoryCollectionName(taskCategory),
      taskId
    );

    return updateDoc(taskDocRef, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      prio: task.prio,
      contacts: task.contacts,
    });
  }

  // Get all tasks from task collections

  getTasksToDo() {
    this.allTasksToDo$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'tasksToDo')
    );
    this.allTasksToDo$.subscribe((data) => {
      this.allTasksToDo = data;
    });
  }

  getTasksInProgress() {
    this.allTasksInProgress$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'tasksInProgress')
    );
    this.allTasksInProgress$.subscribe((data) => {
      this.allTasksInProgress = data;
    });
  }
  getTasksAwaitingFeedback() {
    this.allTasksAwaitingFeedback$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'tasksAwaitingFeedback')
    );
    this.allTasksAwaitingFeedback$.subscribe((data) => {
      this.allTasksAwaitingFeedback = data;
    });
  }
  getTasksDone() {
    this.allTasksDone$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'tasksDone')
    );
    this.allTasksDone$.subscribe((data) => (this.allTasksDone = data));
  }
}
