import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Task } from 'src/app/models/tasks.model';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';
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
        console.log('Add task is successful');
        this.clearInput();
      })
      .catch((error) => {
        console.error('Add task was failed:', error);
      });
  }

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

  updateTaskCategoryInFirestore(task: Task) {
    const collectionRef = collection(
      this.firestore,
      'users',
      this.userId,
      this.getCategoryCollectionName(task.category) // Funktion, um den Namen der Kategorie-basierten Collection zu erhalten
    );

    const taskDocRef = doc(collectionRef, task.taskId);

    updateDoc(taskDocRef, { category: task.category })
      .then(() => {
        console.log('Task category updated successfully');
      })
      .catch((error) => {
        console.error('Failed to update task category:', error);
      });
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
      console.log('Subtask deleted successfully');
    });
  }

  getSubtasksFromFirestore() {
    this.subtasks$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'subtasks')
    );
    this.subtasks$.subscribe((data) => {
      this.subtasks = data;
      console.log(this.subtasks);
    });
  }

  getCategoriesFromFirestore() {
    this.categories$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'categories')
    );
    this.categories$.subscribe((data) => {
      this.categories = data;
      console.log(this.categories);
    });
  }

  getCategoryColor(category: string): string {
    const selectedCategory = this.categories.find(
      (item) => item.name === category
    );
    return selectedCategory ? selectedCategory.color : '';
  }

  getCategoryName(category: string): string {
    const selectedCategory = this.categories.find(
      (item) => item.name === category
    );
    return selectedCategory ? selectedCategory.name : '';
  }

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

  loadCheckedSubtasks() {
    const savedCheckedSubtasks = localStorage.getItem('checkedSubtasks');
    if (savedCheckedSubtasks) {
      this.checkedSubtasks = JSON.parse(savedCheckedSubtasks);
    }
  }

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
}
