import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './tutor-card.component.html',
  styleUrls: ['./tutor-card.component.scss'],
})
export class TutorCardComponent {
  @Input() tutor!: Tutor;
  imageError = false;

  private router = inject(Router);

  hasPhoto(): boolean {
    return !!this.tutor?.foto?.url && !this.imageError;
  }

  onImageError(): void {
    this.imageError = true;
  }

  onCardClick(): void {
    this.router.navigate(['/tutores', this.tutor.id, 'edit']);
  }
}
