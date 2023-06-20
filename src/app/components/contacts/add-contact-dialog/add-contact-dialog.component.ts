import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddContactService } from 'src/app/shared/services/add-contact.service';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.scss'],
})
export class AddContactDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AddContactDialogComponent>,
    public contactService: AddContactService
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
}