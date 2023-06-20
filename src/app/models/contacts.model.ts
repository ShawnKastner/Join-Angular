export class Contact {
  name!: string;
  email!: string;
  phone!: string;
  firstLetter!: string;
  color: string;

  constructor(name: string, email: string, phone: string, firstLetter: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.firstLetter = firstLetter.toUpperCase();
    this.color = this.getRandomColor();
  }

  private getRandomColor(): string {
    const colors = [
      '#8AA4FF',
      '#FF0000',
      '#2AD300',
      '#FF8A00',
      '#E200BE',
      '#0038FF',
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
}
