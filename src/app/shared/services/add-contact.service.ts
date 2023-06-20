import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Contact } from 'src/app/models/contacts.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AddContactService {
  name!: string;
  email!: string;
  phone!: string;
  userId!: any;

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.getUid();
  }

  async getUid() {
    this.userId = await this.authService.getCurrentUserUid();
  }

  addContact() {
    const contactCollection = collection(
      this.firestore,
      'users',
      this.userId,
      'contacts'
    );
    const nameParts = this.name.split(' ');
    const firstNameLetter = nameParts[0].charAt(0);
    const lastNameLetter = nameParts[1].charAt(0);

    const contact = new Contact(
      this.name,
      this.email,
      this.phone,
      `${firstNameLetter}${lastNameLetter}`
    );

    addDoc(contactCollection, { ...contact })
      .then(() => {
        console.log('Contact added successfully');
        this.clearInput();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  clearInput() {
    this.name = '';
    this.email = '';
    this.phone = '';
  }
}
