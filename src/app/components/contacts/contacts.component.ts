import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from './add-contact-dialog/add-contact-dialog.component';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EditContactDialogComponent } from './edit-contact-dialog/edit-contact-dialog.component';
import { Contact } from 'src/app/models/contacts.model';
import { AddContactService } from 'src/app/shared/services/add-contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  selectedContact: any;

  constructor(
    private dialog: MatDialog,
    public contactService: AddContactService
  ) {}

  ngOnInit() {
    this.contactService.getUid().then(() => {
      this.contactService.getContactsFromFirestore();
    });
  }

  openAddContactDialog() {
    this.dialog.open(AddContactDialogComponent, {
      width: '1212px',
      height: '594px',
      panelClass: 'slide-in-dialog',
    });
  }

  showContactDetails(contact: any) {
    this.selectedContact = contact;
  }

  openEditContact() {
    if (this.selectedContact) {
      const dialogRef = this.dialog.open(EditContactDialogComponent, {
        width: '1212px',
        height: '594px',
        data: { contact: this.selectedContact },
      });
      dialogRef
        .afterClosed()
        .subscribe((updatedContact: Contact | undefined) => {
          if (updatedContact) {
            console.log('Updated contact:', updatedContact);
            this.selectedContact = updatedContact;
          }
        });
    }
  }
}
