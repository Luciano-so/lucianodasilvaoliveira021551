import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card-image',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss'],
})
export class CardImageComponent {
  @Input() alt: string = '';
  @Input() icon: string = 'person';
  @Input() photoUrl: string | null | undefined = null;

  hasError = false;

  hasPhoto(): boolean {
    return !!this.photoUrl && !this.hasError;
  }

  onImageError(): void {
    this.hasError = true;
  }
}
