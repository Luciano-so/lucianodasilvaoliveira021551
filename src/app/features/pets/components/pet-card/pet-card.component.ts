import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CardImageComponent } from '../../../../shared/components/card-image/card-image.component';
import { AgeFormatPipe } from '../../../../shared/pipes/age-format.pipe';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    CardImageComponent,
    AgeFormatPipe,
  ],
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.scss'],
})
export class PetCardComponent {
  @Input() pet!: Pet;

  private router = inject(Router);

  onCardClick(): void {
    this.router.navigate(['/pets', this.pet.id]);
  }
}
