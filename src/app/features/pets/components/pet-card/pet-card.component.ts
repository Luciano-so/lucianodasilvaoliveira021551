import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CardImageComponent } from '../../../../shared/components/card-image/card-image.component';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, CardImageComponent],
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.scss'],
})
export class PetCardComponent {
  @Input() pet!: Pet;

  private router = inject(Router);

  getAgeText(idade: number | null | undefined): string {
    if (idade === null || idade === undefined) {
      return '';
    }
    if (idade === 1) {
      return '1 ano';
    }
    return `${idade} anos`;
  }

  onCardClick(): void {
    this.router.navigate(['/pets', this.pet.id, 'edit']);
  }
}
