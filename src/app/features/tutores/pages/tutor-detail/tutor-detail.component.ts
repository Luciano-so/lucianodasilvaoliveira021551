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
import { CpfFormatPipe } from '../../../../shared/pipes/cpf-format.pipe';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { PetLinkComponent } from '../../components/pet-link/pet-link.component';
import { TutoresFacade } from '../../facades/tutores.facade';
import { Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-tutor-detail',
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
    PetLinkComponent,
    PhoneFormatPipe,
    CpfFormatPipe,
  ],
  templateUrl: './tutor-detail.component.html',
  styleUrls: ['./tutor-detail.component.scss'],
})
export class TutorDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private tutoresFacade = inject(TutoresFacade);

  tutorId: number = 0;
  tutor: Tutor | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tutorId = +id;
      this.loadTutor(this.tutorId);
    }
  }

  private loadTutor(id: number): void {
    this.tutoresFacade.loadTutorById(id);
    this.tutoresFacade.selectedTutor$
      .pipe(
        filter((tutor) => tutor !== null && tutor.id === id),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((tutor) => {
        this.tutor = tutor;
      });
  }

  onBack(): void {
    this.router.navigate(['/tutores']);
  }

  onEdit(): void {
    this.router.navigate(['/tutores', this.tutorId, 'edit']);
  }
}
