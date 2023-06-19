export class Contact {
  name!: string;
  email!: string;
  phone!: number;

  constructor(name: string, email: string, phone: number) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}
