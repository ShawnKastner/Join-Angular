import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contact } from 'src/app/models/contacts.model';
import { ContactService } from 'src/app/shared/services/contact.service';

@Component({
  selector: 'app-edit-contact-dialog',
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss'],
})
export class EditContactDialogComponent {
  contact: Contact = new Contact(
    this.data.contact.name,
    this.data.contact.email,
    this.data.contact.phone,
    this.data.contact.firstLetter,
    this.data.contact.color,
  );

  constructor(
    private dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public contactService: ContactService
  ) {}

  closeDialog() {
    this.dialogRef.close(this.contact);
  }

  deleteContact() {
    this.contactService.deleteContact(this.data.contact.contactId);
    this.closeDialog();
  }

  editContact() {
    this.contactService.editContact(this.data.contact.contactId, this.contact);
    this.closeDialog();
  }
}
