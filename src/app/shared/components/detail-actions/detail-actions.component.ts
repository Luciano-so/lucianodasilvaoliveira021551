import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-detail-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './detail-actions.component.html',
  styleUrls: ['./detail-actions.component.scss'],
})
export class DetailActionsComponent {
  @Output() back = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  onBack(): void {
    this.back.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }
}
