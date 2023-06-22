export class Contact {
  name!: string;
  email!: string;
  phone!: string;
  firstLetter!: string;
  color: string;

  constructor(name: string, email: string, phone: string, firstLetter: string, color: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.firstLetter = firstLetter.toUpperCase();
    this.color = color;
  }

  private getRandomColor(): string {
    const colors = [
      '#8AA4FF',
      '#FF0000',
      '#2AD300',
      '#FF8A00',
      '#E200BE',
      '#0038FF',
      '#9327FF',
      '#29ABE2',
      '#FC71FF',
      '#41DB63',
      '#AF1616',
      '#462F8A'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
}
