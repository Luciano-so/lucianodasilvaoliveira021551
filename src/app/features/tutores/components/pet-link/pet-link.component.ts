import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityPhotoComponent } from '../../../../shared/components/entity-photo/entity-photo.component';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { PetsFacade } from '../../../pets/facades/pets.facade';
import { Pet } from '../../../pets/models/pet.model';
import { TutoresFacade } from '../../facades/tutores.facade';

@Component({
  selector: 'app-pet-link',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTooltipModule,
    EntityPhotoComponent,
  ],
  templateUrl: './pet-link.component.html',
  styleUrls: ['./pet-link.component.scss'],
})
export class PetLinkComponent implements OnInit, OnDestroy {
  @Input() tutorId!: number;
  @Input() readOnly = false;

  linkedPets: Pet[] = [];
  availablePets: Pet[] = [];
  selectedPetControl = new FormControl<number | null>(null);

  private destroy$ = new Subject<void>();
  private petsFacade = inject(PetsFacade);
  private tutoresFacade = inject(TutoresFacade);
  private confirmService = inject(ConfirmDialogService);

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.tutoresFacade.selectedTutor$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tutor) => {
        if (tutor && tutor.id === this.tutorId) {
          this.linkedPets = tutor.pets || [];
          this.loadAvailablePets();
        }
      });

    this.petsFacade.loadPets({ page: 0, size: 100 });
  }

  private loadAvailablePets(): void {
    this.petsFacade.pets$.pipe(takeUntil(this.destroy$)).subscribe((pets) => {
      const linkedPetIds = this.linkedPets.map((p) => p.id);
      this.availablePets = pets.filter((p) => !linkedPetIds.includes(p.id));
    });
  }

  onLinkPet(): void {
    const petId = this.selectedPetControl.value;
    if (petId) {
      const pet = this.availablePets.find((p) => p.id === petId);
      this.confirmService
        .openConfirm({
          title: 'Confirmar Vinculação',
          message: `Tem certeza que deseja vincular o pet <strong>"${pet?.nome}"</strong> a este tutor?`,
        })
        .subscribe((result) => {
          if (result) {
            this.tutoresFacade.linkPet(this.tutorId, petId).subscribe({
              next: () => {
                this.selectedPetControl.reset();
              },
            });
          }
        });
    }
  }

  onUnlinkPet(petId: number): void {
    const pet = this.linkedPets.find((p) => p.id === petId);
    this.confirmService
      .openConfirm({
        message: `Tem certeza que deseja desvincular o pet "${pet?.nome}" do tutor?`,
      })
      .subscribe((result) => {
        if (result) {
          this.tutoresFacade.unlinkPet(this.tutorId, petId).subscribe();
        }
      });
  }
}
