import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.scss']
})
export class AddContactDialogComponent {

  constructor(private dialogRef: MatDialogRef<AddContactDialogComponent>) {}

  closeDialog() {
    const dialogRefEl = document.querySelector('.cdk-overlay-pane') as HTMLElement;
    dialogRefEl.classList.add('slide-out-dialog');
    setTimeout(() => {
      this.dialogRef.close();
    }, 400);
  }
}
