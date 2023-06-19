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
import { AddTaskService } from 'src/app/shared/services/add-task.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  minDate!: Date;

  categories$!: Observable<any[]>;
  categories: any[] = [];

  subtasks$!: Observable<any[]>;
  subtasks: any[] = [];

  userId!: any;

  constructor(
    private firestore: Firestore,
    private dialog: MatDialog,
    public addTaskService: AddTaskService,
    private authService: AuthService
  ) {
    this.minDate = new Date();
  }

  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }

  ngOnInit(): void {
    this.getUid().then(() => {
      this.getCategoriesFromFirestore();
      this.getSubtasksFromFirestore();
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
}
