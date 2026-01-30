import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EntityPhotoComponent } from '../../../../shared/components/entity-photo/entity-photo.component';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { Tutor } from '../../../tutores/models/tutor.model';
import { PetsFacade } from '../../facades/pets.facade';

@Component({
  selector: 'app-tutor-link',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    PhoneFormatPipe,
    EntityPhotoComponent,
  ],
  templateUrl: './tutor-link.component.html',
  styleUrls: ['./tutor-link.component.scss'],
})
export class TutorLinkComponent implements OnInit {
  @Input() petId!: number;
  @Input() readOnly = false;

  linkedTutors: Tutor[] = [];

  private petsFacade = inject(PetsFacade);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.petsFacade.selectedPet$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pet) => {
        if (pet && pet.id === this.petId && pet.tutores) {
          this.linkedTutors = pet.tutores;
        } else {
          this.linkedTutors = [];
        }
      });
  }
}
