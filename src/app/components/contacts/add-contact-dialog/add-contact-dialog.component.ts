import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ContactService } from 'src/app/shared/services/contact.service';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.scss'],
})
export class AddContactDialogComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', [Validators.required]);

  constructor(
    private dialogRef: MatDialogRef<AddContactDialogComponent>,
    public contactService: ContactService
  ) {}

  closeDialog() {
    const dialogRefEl = document.querySelector(
      '.cdk-overlay-pane'
    ) as HTMLElement;
    dialogRefEl.classList.add('slide-out-dialog');
    setTimeout(() => {
      this.dialogRef.close();
    }, 400);
  }

  addContact() {
    this.contactService.addContact();
    this.closeDialog();
  }

  /**
   * The `getErrorMessageEmail()` method is a helper method that returns an error message based on the validation status of
   * the email form control.
   * 
   * @method
   * @name getErrorMessageEmail
   * @kind method
   * @memberof AddContactDialogComponent
   * @returns {"" | "You must enter a email" | "Not a valid email"}
   */
  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'You must enter a email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  /**
   * The `getErrorMessageName()` method is a helper method that returns an error message based on the validation status of
   * the name form control.
   * 
   * @method
   * @name getErrorMessageName
   * @kind method
   * @memberof AddContactDialogComponent
   * @returns {"" | "You must enter a name" | "Not a valid name"}
   */
  getErrorMessageName() {
    if (this.name.hasError('required')) {
      return 'You must enter a name';
    }

    return this.name.hasError('name') ? 'Not a valid name' : '';
  }
}
