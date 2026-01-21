import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  openConfirm(options: { title?: string; message: string }) {
    return this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: options.title || 'Confirmação',
          message: options.message,
        },
        disableClose: true,
      })
      .afterClosed();
  }
}
