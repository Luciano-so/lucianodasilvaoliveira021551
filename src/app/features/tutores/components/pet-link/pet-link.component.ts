import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AutocompleteComponent,
  AutocompleteOption,
} from '../../../../shared/components/autocomplete/autocomplete.component';
import { EntityPhotoComponent } from '../../../../shared/components/entity-photo/entity-photo.component';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { PetsFacade } from '../../../pets/facades/pets.facade';
import { Pet, PetListResponse } from '../../../pets/models/pet.model';
import { PetsService } from '../../../pets/services/pets.service';
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
    AutocompleteComponent,
  ],
  templateUrl: './pet-link.component.html',
  styleUrls: ['./pet-link.component.scss'],
})
export class PetLinkComponent implements OnInit {
  @Input() tutorId!: number;
  @Input() readOnly = false;

  linkedPets: Pet[] = [];
  availablePets: Pet[] = [];
  selectedPet: Pet | null = null;
  searchResults: Pet[] = [];

  @ViewChild('autocomplete') autocomplete!: AutocompleteComponent;
  private petsFacade = inject(PetsFacade);
  private petsService = inject(PetsService);
  private tutoresFacade = inject(TutoresFacade);
  private confirmService = inject(ConfirmDialogService);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.tutoresFacade.selectedTutor$
      .pipe(takeUntilDestroyed())
      .subscribe((tutor) => {
        if (tutor && tutor.id === this.tutorId) {
          this.linkedPets = tutor.pets || [];
          if (!this.readOnly) {
            this.loadAvailablePets();
          }
        }
      });
  }

  private loadAvailablePets(): void {
    this.petsFacade
      .loadAllPets()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (allPets) => {
          const linkedPetIds = this.linkedPets.map((p) => p.id);
          this.availablePets = allPets.filter(
            (p) => !linkedPetIds.includes(p.id),
          );
        },
      });
  }

  onLinkPet(): void {
    if (this.selectedPet) {
      this.confirmService
        .openConfirm({
          title: 'Confirmar Vinculação',
          message: `Tem certeza que deseja vincular o pet <strong>"${this.selectedPet.nome}"</strong> a este tutor?`,
        })
        .pipe(takeUntilDestroyed())
        .subscribe((result) => {
          if (result) {
            this.tutoresFacade
              .linkPet(this.tutorId, this.selectedPet!.id)
              .pipe(takeUntilDestroyed())
              .subscribe({
                next: () => {
                  this.selectedPet = null;
                  this.autocomplete.clear();
                },
              });
          }
        });
    }
  }

  onPetSelected(option: AutocompleteOption): void {
    const pet = this.searchResults.find((p) => p.id === option.id);
    if (pet) {
      this.selectedPet = pet;
    }
  }

  searchPets(query: string): Observable<AutocompleteOption[]> {
    return this.petsService.getPets({ nome: query, size: 20 }).pipe(
      map((response: PetListResponse) => {
        const linkedPetIds = this.linkedPets.map((p) => p.id);
        this.searchResults = response.content.filter(
          (pet) => !linkedPetIds.includes(pet.id),
        );
        return this.searchResults.map((pet) => ({
          id: pet.id,
          label: pet.nome,
          raca: pet?.raca || undefined,
          foto: pet?.foto,
        }));
      }),
    );
  }

  displayPet(option: AutocompleteOption): string {
    return option ? option.label : '';
  }

  onUnlinkPet(petId: number): void {
    const pet = this.linkedPets.find((p) => p.id === petId);
    if (pet) {
      this.confirmService
        .openConfirm({
          message: `Tem certeza que deseja desvincular o pet <strong>"${pet.nome}"</strong> do tutor?`,
        })
        .pipe(takeUntilDestroyed())
        .subscribe((result) => {
          if (result) {
            this.tutoresFacade
              .unlinkPet(this.tutorId, petId)
              .pipe(takeUntilDestroyed())
              .subscribe();
          }
        });
    }
  }
}
