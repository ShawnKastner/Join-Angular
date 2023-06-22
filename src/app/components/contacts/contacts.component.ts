import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from './add-contact-dialog/add-contact-dialog.component';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EditContactDialogComponent } from './edit-contact-dialog/edit-contact-dialog.component';
import { Contact } from 'src/app/models/contacts.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  contacts$!: Observable<any[]>;
  contacts: any[] = [];
  userId!: any;
  selectedContact: any;

  constructor(
    private dialog: MatDialog,
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getUid().then(() => {
      this.getContactsFromFirestore();
    });
  }

  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }

  openAddContactDialog() {
    this.dialog.open(AddContactDialogComponent, {
      width: '1212px',
      height: '594px',
      panelClass: 'slide-in-dialog',
    });
  }

  getContactsFromFirestore() {
    this.contacts$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'contacts')
    );
    this.contacts$.subscribe((data) => {
      this.contacts = data;
    });
  }

  getAlphabetLettersWithContacts(): string[] {
    const letters: string[] = [];
    this.contacts.forEach((contact) => {
      const firstLetter = contact.firstLetter.toUpperCase();
      if (!letters.includes(firstLetter)) {
        letters.push(firstLetter);
      }
    });
    return letters;
  }

  getContactsByLetter(letter: string): any[] {
    return this.contacts.filter((contact) => contact.firstLetter === letter);
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
