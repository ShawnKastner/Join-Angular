import { Component } from '@angular/core';
import { Firestore, doc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  userId!: string | null;

  constructor(
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>
  ) {
    this.getUid();
  }

  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * The `addCategory()` method is responsible for adding a new category to the Firestore database. It creates a new document
   * in the "categories" collection under the user's document. The document contains the name of the category
   * (`this.newCategory`) and the selected color (`this.selectedColor`). If the addition is successful, it logs a message to
   * the console and closes the dialog. If there is an error, it logs the error message to the console.
   *
   * @method
   * @name addCategory
   * @kind method
   * @memberof NewCategoryDialogComponent
   * @returns {void}
   */
  async addCategory() {
    if (!this.userId) {
      this.snackBar.open('User ID is null or undefined.', 'Schließen', {
        duration: 3000,
      });
      return;
    }

    const userDocRef = doc(this.firestore, 'users', this.userId);
    const categoryCollectionRef = collection(userDocRef, 'categories');

    try {
      await addDoc(categoryCollectionRef, {
        name: this.newCategory,
        color: this.selectedColor,
      });
      this.dialogRef.close();
    } catch (error) {
      console.error('Error adding new category:', error);
    }
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }
}
