import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Contact } from 'src/app/models/contacts.model';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AddContactService {
  name!: string;
  email!: string;
  phone!: string;
  color!: string;
  userId!: any;

  constructor(private firestore: Firestore, private authService: AuthService, private afs: AngularFirestore) {
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
    const contactId = this.afs.createId();
    const contactDocRef = doc(contactCollection, contactId);

    const contact = new Contact(
      this.name,
      this.email,
      this.phone,
      `${firstNameLetter}${lastNameLetter}`,
      this.color
    );

    setDoc(contactDocRef, { ...contact, contactId: contactId })
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

  editContact(contactId: string, contact: Contact): Promise<void> {
    const contactDocRef = doc(
      this.firestore,
      'users',
      this.userId,
      'contacts',
      contactId
    );
  
    return updateDoc(contactDocRef, {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      firstLetter: contact.firstLetter
    });
  }
  
}
