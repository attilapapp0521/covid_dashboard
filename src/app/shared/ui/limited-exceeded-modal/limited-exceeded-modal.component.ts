import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-limited-exceeded-modal',
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './limited-exceeded-modal.component.html',
  styleUrl: './limited-exceeded-modal.component.scss',
})
export class LimitExceededModalComponent {
  constructor(
    private dialogRef: MatDialogRef<LimitExceededModalComponent>,
    private router: Router,
  ) {}

  navigateToRegister(): void {
    this.router.navigate(['/register']);
    this.dialogRef.close();
  }
}
