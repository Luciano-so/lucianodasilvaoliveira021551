import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-entity-photo',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './entity-photo.component.html',
  styleUrls: ['./entity-photo.component.scss'],
})
export class EntityPhotoComponent {
  @Input() alt: string = '';
  @Input() entityId: number = 0;
  @Input() icon: string = 'person';
  @Input() photoUrl: string | null | undefined | undefined = null;

  hasError = false;

  onImageError(): void {
    this.hasError = true;
  }
}
