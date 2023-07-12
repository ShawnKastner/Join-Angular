import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Contact } from 'src/app/models/contacts.model';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  name!: string;
  email!: string;
  phone!: string;
  color!: string;
  userId!: any;
  contacts$!: Observable<any[]>;
  contacts: any[] = [];
  selectedContact: any;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private afs: AngularFirestore
  ) {
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
    let firstNameLetter;
    let lastNameLetter;
    if (nameParts.length === 2) {
      firstNameLetter = nameParts[0].charAt(0);
      lastNameLetter = nameParts[1].charAt(0);
    } else {
      firstNameLetter = nameParts[0].charAt(0);
      lastNameLetter = '';
    }
    const contactId = this.afs.createId();
    const contactDocRef = doc(contactCollection, contactId);

    const contact = new Contact(
      this.name,
      this.email,
      this.phone || '',
      `${firstNameLetter}${lastNameLetter}`,
      this.color
    );

    setDoc(contactDocRef, { ...contact, contactId: contactId })
      .then(() => {
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
      firstLetter: contact.firstLetter,
    });
  }

  deleteContact(contactId: string): Promise<void> {
    const contactDocRef = doc(
      this.firestore,
      'users',
      this.userId,
      'contacts',
      contactId
    );

    return deleteDoc(contactDocRef).then(() => {
      this.selectedContact = null;
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

  getContactColor(contact: string): string {
    const selectedContact = this.contacts.find(
      (item: { name: string }) => item.name === contact
    );
    return selectedContact ? selectedContact.color : '';
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

  getContactInitials(contact: string): string {
    const nameParts = contact.split(' ');
    const initials = nameParts.map((namePart) => namePart.charAt(0));
    return initials.join('');
  }
}
