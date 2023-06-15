import { Component } from '@angular/core';

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
}
