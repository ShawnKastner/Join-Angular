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
  phone!: number;
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
    const contact = new Contact(this.name, this.email, this.phone);
    addDoc(contactCollection, { ...contact })
      .then(() => {
        console.log('Contact added successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
