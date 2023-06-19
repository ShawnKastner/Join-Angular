import { Component, OnInit, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  getDocs,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/tasks.model';
import { NewCategoryDialogComponent } from './new-category-dialog/new-category-dialog.component';
import { Observable } from 'rxjs';
import { deleteDoc } from 'firebase/firestore';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  taskCollection!: CollectionReference;
  minDate!: Date;
  title!: string;
  description!: string;
  category!: string;
  selectedContact!: string;
  date!: string;
  selectedPriority!: string;
  subtask!: string;
  selectedSubtasks: { [key: string]: boolean } = {};

  categories$!: Observable<any[]>;
  categories: any[] = [];

  subtasks$!: Observable<any[]>;
  subtasks: any[] = [];

  constructor(private firestore: Firestore, private dialog: MatDialog) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.getCategoriesFromFirestore();
    this.getSubtasksFromFirestore();
  }

  getSubtasksFromFirestore() {
    this.subtasks$ = collectionData(collection(this.firestore, 'subtasks'));
    this.subtasks$.subscribe((data) => {
      this.subtasks = data;
      console.log(this.subtasks);
    });
  }

  getCategoriesFromFirestore() {
    this.categories$ = collectionData(collection(this.firestore, 'categories'));
    this.categories$.subscribe((data) => {
      this.categories = data;
      console.log(this.categories);
    });
  }

  getSelectedSubtasks(): string[] {
    return Object.keys(this.selectedSubtasks).filter(
      (key) => this.selectedSubtasks[key]
    );
  }

  addTask() {
    const collectionRef = collection(this.firestore, 'tasks');
    const newTask = new Task(
      this.title,
      this.description,
      this.category,
      this.selectedContact,
      new Date(this.date),
      this.selectedPriority,
      this.getSelectedSubtasks().join(',')
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

  openAddCategoryDialog() {
    this.dialog.open(NewCategoryDialogComponent, {
      width: '250px',
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

  addSubtask() {
    const subTaskCollection = collection(this.firestore, 'subtasks');
    addDoc(subTaskCollection, {
      subtask: this.subtask,
    }).then(() => {
      this.subtask = '';
    });
  }

  async deleteAllSubtasks() {
    const subTaskCollectionRef = collection(this.firestore, 'subtasks');
    const querySnapshot = await getDocs(subTaskCollectionRef);
    
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log('Subtask deleted successfully');
    });
    
  }
}
