import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddContactDialogComponent } from './add-contact-dialog/add-contact-dialog.component';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EditContactDialogComponent } from './edit-contact-dialog/edit-contact-dialog.component';
import { Contact } from 'src/app/models/contacts.model';
import { ContactService } from 'src/app/shared/services/contact.service';
import { AddTaskDialogComponent } from '../board/add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public contactService: ContactService
  ) {}

  ngOnInit() {
    this.contactService.getUid().then(() => {
      this.contactService.getContactsFromFirestore();
    });
  }

  openAddContactDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = [
      'add-c-dialog-media',
      'slide-in-dialog',
      'add-c-dialog-height',
    ];
    this.dialog.open(AddContactDialogComponent, {
      ...dialogConfig,
    });
  }

  showContactDetails(contact: any) {
    this.contactService.selectedContact = contact;
  }

  deleteContact() {
    this.contactService.deleteContact(
      this.contactService.selectedContact.contactId
    );
  }

  openEditContact() {
    if (this.contactService.selectedContact) {
      const dialogRef = this.dialog.open(EditContactDialogComponent, {
        width: '1212px',
        height: '594px',
        data: { contact: this.contactService.selectedContact },
      });
      dialogRef
        .afterClosed()
        .subscribe((updatedContact: Contact | undefined) => {
          if (updatedContact) {
            this.contactService.selectedContact = updatedContact;
          }
        });
    }
  }

  openAddTaskDialog(taskCategory: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = [
      'dialog-media-height',
      'slide-in-dialog',
      'add-task-dialog-width',
    ];
    this.dialog.open(AddTaskDialogComponent, {
      ...dialogConfig,
      data: { taskCategory: taskCategory },
    });
  }

  backToContactList() {
    this.contactService.selectedContact = null;
  }
}
