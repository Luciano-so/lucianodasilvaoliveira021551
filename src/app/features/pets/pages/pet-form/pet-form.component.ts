import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';
import { PhotoUploadComponent } from '../../../../shared/components/photo-upload/photo-upload.component';
import { RelationSectionComponent } from '../../../../shared/components/relation-section/relation-section.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { MatErrorMessagesDirective } from '../../../../shared/directives/matErrorMessagesDirective';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { TutorLinkComponent } from '../../components/tutor-link/tutor-link.component';
import { PetsFacade } from '../../facades/pets.facade';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatErrorMessagesDirective,
    FormHeaderComponent,
    FormActionsComponent,
    PhotoUploadComponent,
    TutorLinkComponent,
    RelationSectionComponent,
  ],

  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss'],
})
export class PetFormComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private petsFacade = inject(PetsFacade);
  private toastService = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);

  petId?: number;
  isEditMode = false;
  petForm!: FormGroup;
  photoRemoved: boolean = false;
  linkedTutorIds: number[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  currentPhotoId: number | null = null;
  currentPhotoUrl: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.petForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      raca: ['', [Validators.minLength(1), Validators.maxLength(100)]],
      idade: ['', [Validators.min(0), Validators.max(50)]],
    });
  }

  private checkEditMode(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.photoRemoved = false;
    this.currentPhotoId = null;
    this.currentPhotoUrl = null;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.petId = +id;
      this.loadPet(this.petId);
    }
  }

  private loadPet(id: number): void {
    this.petsFacade.loadPetById(id);
    this.petsFacade.selectedPet$
      .pipe(
        filter((pet) => pet !== null && pet.id === id),
        takeUntil(this.destroy$),
      )
      .subscribe((pet) => {
        if (pet) {
          this.petForm.patchValue({
            nome: pet.nome,
            raca: pet.raca,
            idade: pet.idade,
          });
          if (pet.foto) {
            this.currentPhotoUrl = pet.foto.url;
            this.currentPhotoId = pet.foto.id;
          }
          this.linkedTutorIds = pet.tutores?.map((t) => t.id) || [];
        }
      });
  }

  onSubmit(): void {
    if (!this.petForm.valid) {
      this.toastService.onShowError(
        'Por favor, corrija os erros no formulário.',
      );
      this.markFormGroupTouched(this.petForm);
      return;
    }

    const petData = this.petForm.value;
    const message = this.isEditMode
      ? `Deseja salvar as alterações feitas em <strong>"${petData.nome}</strong>"?`
      : `Deseja cadastrar o pet <strong>"${petData.nome}</strong>"?`;

    this.confirmDialogService
      .openConfirm({
        title: this.isEditMode ? 'Confirmar Alterações' : 'Confirmar Cadastro',
        message: message,
      })
      .pipe(
        filter((confirmed): confirmed is boolean => confirmed === true),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        if (this.isEditMode && this.petId) {
          this.handleUpdate(petData);
        } else {
          this.handleCreate(petData);
        }
      });
  }

  private handleCreate(petData: any): void {
    this.petsFacade.createPetWithPhoto(petData, this.selectedFile).subscribe({
      next: () => {
        this.toastService.onShowOk('Pet cadastrado com sucesso!');
        this.onBack();
      },
      error: (error) => {
        this.toastService.onShowError('Erro ao cadastrar pet.', error);
      },
    });
  }

  private handleUpdate(petData: any): void {
    this.petsFacade
      .updatePetWithPhoto(this.petId!, petData, {
        newPhoto: this.selectedFile,
        currentPhotoId: this.currentPhotoId,
        photoRemoved: this.photoRemoved,
      })
      .subscribe({
        next: () => {
          this.toastService.onShowOk('Pet atualizado com sucesso!');
          this.onBack();
        },
        error: (error) => {
          this.toastService.onShowError('Erro ao atualizar pet.', error);
        },
      });
  }

  onBack(): void {
    this.router.navigate(['/pets']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onFileSelected(file: File): void {
    if (file) {
      this.selectedFile = file;
      this.photoRemoved = false;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.photoRemoved = true;
    this.currentPhotoUrl = null;
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onDelete(): void {
    if (!this.petId) return;

    const petName = this.petForm.get('nome')?.value || 'este pet';
    const hasTutors = this.linkedTutorIds.length > 0;
    let message = `Tem certeza que deseja excluir <strong>"${petName}"</strong>?`;
    if (hasTutors) {
      message += `\n Este pet está vinculado a <strong>${this.linkedTutorIds.length}</strong> tutor(es) e será desvinculado automaticamente.`;
    }

    this.confirmDialogService
      .openConfirm({
        title: 'Confirmar Exclusão',
        message: message,
      })
      .pipe(
        filter((confirmed): confirmed is boolean => confirmed === true),
        switchMap(() => {
          if (hasTutors) {
            return forkJoin(
              this.linkedTutorIds.map((tutorId) =>
                this.petsFacade.unlinkTutor(tutorId, this.petId!),
              ),
            ).pipe(switchMap(() => of(true)));
          }
          return of(true);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.petsFacade.deletePet(this.petId!);
          this.toastService.onShowOk('Pet excluído com sucesso!');
          this.onBack();
        },
        error: (error: any) => {
          this.toastService.onShowError('Erro ao excluir pet.', error);
        },
      });
  }
}
