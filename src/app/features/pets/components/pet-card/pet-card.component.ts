import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.scss'],
})
export class PetCardComponent {
  @Input() pet!: Pet;
  imageError = false;

  private router = inject(Router);

  hasPhoto(): boolean {
    return !!this.pet?.foto?.url && !this.imageError;
  }

  onImageError(): void {
    this.imageError = true;
  }

  getAgeText(idade: number): string {
    if (idade === 1) {
      return '1 ano';
    }
    return `${idade} anos`;
  }

  onCardClick(): void {
    this.router.navigate(['/pets', this.pet.id, 'edit']);
  }
}
