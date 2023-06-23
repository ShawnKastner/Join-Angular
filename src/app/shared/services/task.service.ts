import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  getDocs,
} from '@angular/fire/firestore';
import { Task } from 'src/app/models/tasks.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

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

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.getUid();
  }

  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }

  addTask() {
    const collectionRef = collection(
      this.firestore,
      'users',
      this.userId,
      'tasks'
    );
    const categoryColor = this.getCategoryColor(this.category);
    const newTask = new Task(
      this.title,
      this.description,
      this.category,
      this.selectedContact,
      new Date(this.date),
      this.selectedPriority,
      this.getSelectedSubtasks(),
      categoryColor
    );
    addDoc(collectionRef, { ...newTask })
      .then(() => {
        console.log('Add task is successful');
        this.clearInput();
      })
      .catch((error) => {
        console.error('Add task was failed:', error);
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
}
