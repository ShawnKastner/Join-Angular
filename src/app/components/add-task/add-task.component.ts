import { Component, OnInit, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/tasks.model';
import { NewCategoryDialogComponent } from './new-category-dialog/new-category-dialog.component';
import { Observable } from 'rxjs';

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

  categories$!: Observable<any[]>;
  categories: any[] = [];

  constructor(private firestore: Firestore, private dialog: MatDialog) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.categories$ = collectionData(collection(this.firestore, 'categories'));
    this.categories$.subscribe((data) => {
      this.categories = data;
      console.log(this.categories);
    });
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
      this.subtask
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
  }

  openAddCategoryDialog() {
    this.dialog.open(NewCategoryDialogComponent, {
      width: '250px',
    });
  }

  getCategoryColor(category: string): string {
    const selectedCategory = this.categories.find((item) => item.name === category);
    return selectedCategory ? selectedCategory.color : '';
  }
  
  getCategoryName(category: string): string {
    const selectedCategory = this.categories.find((item) => item.name === category);
    return selectedCategory ? selectedCategory.name : '';
  }
  
}
