import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CardImageComponent } from '../../../../shared/components/card-image/card-image.component';
import { Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, CardImageComponent],
  templateUrl: './tutor-card.component.html',
  styleUrls: ['./tutor-card.component.scss'],
})
export class TutorCardComponent {
  @Input() tutor!: Tutor;

  private router = inject(Router);

  onCardClick(): void {
    this.router.navigate(['/tutores', this.tutor.id, 'edit']);
  }
}
