import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
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
export class TutorLinkComponent implements OnInit, OnDestroy {
  @Input() petId!: number;
  @Input() readOnly = false;

  linkedTutors: Tutor[] = [];

  private destroy$ = new Subject<void>();
  private petsFacade = inject(PetsFacade);

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.petsFacade.selectedPet$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pet) => {
        if (pet && pet.id === this.petId && pet.tutores) {
          this.linkedTutors = pet.tutores;
        }
      });
  }
}
