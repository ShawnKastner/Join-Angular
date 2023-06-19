import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from './add-contact-dialog/add-contact-dialog.component';

export interface Section {
  name: string;
  email: string;
  firstLetter: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  contacts: Section[] = [
    {
      name: 'Anton Mayer',
      email: 'antonm@gmail.com',
      firstLetter: 'AM',
    },
    {
      name: 'Anja Schulz',
      email: 'schulz@hotmail.com',
      firstLetter: 'AS',
    },
  ];

  constructor(private dialog: MatDialog) {}

  openAddContactDialog() {
    this.dialog.open(AddContactDialogComponent, {
      width: '1212px',
      height: '594px',
      panelClass: 'slide-in-dialog',
    });
  }
}
