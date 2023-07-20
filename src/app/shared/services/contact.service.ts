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

  /**
   * The `addContact()` method is responsible for adding a new contact to the Firestore database.
   * 
   * @method
   * @name addContact
   * @kind method
   * @memberof ContactService
   * @returns {void}
   */
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

  /**
   * The `clearInput()` method is a method of the `ContactService` class. It is responsible for clearing the input fields for
   * name, email, and phone. It sets the values of these fields to an empty string, effectively clearing the input.
   * 
   * @method
   * @name clearInput
   * @kind method
   * @memberof ContactService
   * @returns {void}
   */
  clearInput() {
    this.name = '';
    this.email = '';
    this.phone = '';
  }

  /**
   * The `editContact` method in the `ContactService` class is responsible for updating an existing contact in the Firestore
   * database. It takes two parameters: `contactId` (the ID of the contact to be edited) and `contact` (an instance of the
   * `Contact` model representing the updated contact information).
   * 
   * @method
   * @name editContact
   * @kind method
   * @memberof ContactService
   * @param {string} contactId
   * @param {Contact} contact
   * @returns {Promise<void>}
   */
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

  /**
   * The `deleteContact(contactId: string): Promise<void>` method in the `ContactService` class is responsible for deleting a
   * contact from the Firestore database. It takes a `contactId` parameter, which is the ID of the contact to be deleted.
   * 
   * @method
   * @name deleteContact
   * @kind method
   * @memberof ContactService
   * @param {string} contactId
   * @returns {Promise<void>}
   */
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

  /**
   * The `getContactsFromFirestore()` method in the `ContactService` class is responsible for retrieving the contacts from
   * the Firestore database. It uses the `collectionData()` function from the `@angular/fire/firestore` package to get a
   * stream of data from the specified collection in Firestore. The retrieved data is then assigned to the `contacts$`
   * property, which is an observable of an array of contacts. The `contacts$` observable is subscribed to, and when new data
   * is emitted, it updates the `contacts` property with the new data.
   * 
   * @method
   * @name getContactsFromFirestore
   * @kind method
   * @memberof ContactService
   * @returns {void}
   */
  getContactsFromFirestore() {
    this.contacts$ = collectionData(
      collection(this.firestore, 'users', this.userId, 'contacts')
    );
    this.contacts$.subscribe((data) => {
      this.contacts = data;
    });
  }

  /**
   * The `getContactColor(contact: string): string` method in the `ContactService` class is responsible for retrieving the
   * color of a contact based on its name.
   * 
   * @method
   * @name getContactColor
   * @kind method
   * @memberof ContactService
   * @param {string} contact
   * @returns {string}
   */
  getContactColor(contact: string): string {
    const selectedContact = this.contacts.find(
      (item: { name: string }) => item.name === contact
    );
    return selectedContact ? selectedContact.color : '';
  }

  /**
   * The `getAlphabetLettersWithContacts()` method in the `ContactService` class is responsible for retrieving the unique
   * alphabet letters that are present in the names of the contacts.
   * 
   * @method
   * @name getAlphabetLettersWithContacts
   * @kind method
   * @memberof ContactService
   * @returns {string[]}
   */
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

  /**
   * The `getContactsByLetter(letter: string): any[]` method in the `ContactService` class is responsible for filtering the
   * contacts based on the given letter. It takes a `letter` parameter, which is the letter to filter the contacts by.
   * 
   * @method
   * @name getContactsByLetter
   * @kind method
   * @memberof ContactService
   * @param {string} letter
   * @returns {any[]}
   */
  getContactsByLetter(letter: string): any[] {
    return this.contacts.filter((contact) => contact.firstLetter === letter);
  }

  /**
   * The `getContactInitials(contact: string): string` method in the `ContactService` class is responsible for retrieving the
   * initials of a contact's name.
   * 
   * @method
   * @name getContactInitials
   * @kind method
   * @memberof ContactService
   * @param {string} contact
   * @returns {string}
   */
  getContactInitials(contact: string): string {
    const nameParts = contact.split(' ');
    const initials = nameParts.map((namePart) => namePart.charAt(0));
    return initials.join('');
  }
}
