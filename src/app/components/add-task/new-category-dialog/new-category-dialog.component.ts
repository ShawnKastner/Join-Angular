import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { addDoc, collection } from 'firebase/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.scss'],
})
export class NewCategoryDialogComponent {
  newCategory!: string;
  colors: string[] = [
    '#8AA4FF',
    '#FF0000',
    '#2AD300',
    '#FF8A00',
    '#E200BE',
    '#0038FF',
  ];
  selectedColor: string | null = null;

  userId!: any;

  constructor(
    private firestore: Firestore,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    private authService: AuthService
  ) {
    this.getUid();
  }

  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  addCategory() {
    const categoryCollection = collection(this.firestore,'users', this.userId, 'categories');
    addDoc(categoryCollection, {
      name: this.newCategory,
      color: this.selectedColor,
    })
      .then(() => {
        console.log('New category added:', this.newCategory);
        this.dialogRef.close();
      })
      .catch((error) => {
        console.log('Error adding new category:', error);
      });
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }
}
