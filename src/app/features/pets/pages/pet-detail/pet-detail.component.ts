import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CardImageComponent } from '../../../../shared/components/card-image/card-image.component';
import { DetailActionsComponent } from '../../../../shared/components/detail-actions/detail-actions.component';
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';
import { RelationSectionComponent } from '../../../../shared/components/relation-section/relation-section.component';
import { AgeFormatPipe } from '../../../../shared/pipes/age-format.pipe';
import { TutorLinkComponent } from '../../components/tutor-link/tutor-link.component';
import { PetsFacade } from '../../facades/pets.facade';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormHeaderComponent,
    CardImageComponent,
    DetailActionsComponent,
    RelationSectionComponent,
    TutorLinkComponent,
    AgeFormatPipe,
  ],
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.scss'],
})
export class PetDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private petsFacade = inject(PetsFacade);
  private destroyRef = inject(DestroyRef);

  petId: number = 0;
  pet: Pet | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.petId = +id;
      this.loadPet(this.petId);
    }
  }

  private loadPet(id: number): void {
    this.petsFacade.loadPetById(id);
    this.petsFacade.selectedPet$
      .pipe(
        filter((pet) => pet !== null && pet.id === id),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((pet) => {
        this.pet = pet;
      });
  }

  onBack(): void {
    this.router.navigate(['/pets']);
  }

  onEdit(): void {
    this.router.navigate(['/pets', this.petId, 'edit']);
  }
}
