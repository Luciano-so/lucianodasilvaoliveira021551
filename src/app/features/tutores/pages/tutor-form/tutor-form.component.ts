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
import { MaskDirective } from '../../../../shared/directives/mask.directive';
import { MatErrorMessagesDirective } from '../../../../shared/directives/matErrorMessagesDirective';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { cpfValidator } from '../../../../shared/validations/cpf.validation';
import { PetLinkComponent } from '../../components/pet-link/pet-link.component';
import { TutoresFacade } from '../../facades/tutores.facade';

@Component({
  selector: 'app-tutor-form',
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
    MaskDirective,
    FormHeaderComponent,
    PhotoUploadComponent,
    PetLinkComponent,
    FormActionsComponent,
    RelationSectionComponent,
  ],
  templateUrl: './tutor-form.component.html',
  styleUrls: ['./tutor-form.component.scss'],
})
export class TutorFormComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private toastService = inject(ToastService);
  private tutoresFacade = inject(TutoresFacade);
  private confirmService = inject(ConfirmDialogService);

  tutorId?: number;
  isEditMode = false;
  tutorForm!: FormGroup;
  photoRemoved: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  currentPhotoUrl: string | null = null;
  currentPhotoId: number | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.tutorForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      email: ['', [Validators.email, Validators.maxLength(150)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      endereco: ['', [Validators.maxLength(200)]],
      cpf: ['', [cpfValidator]],
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
      this.tutorId = +id;
      this.loadTutor(this.tutorId);
    }
  }

  private loadTutor(id: number): void {
    this.tutoresFacade.loadTutorById(id);
    this.tutoresFacade.selectedTutor$
      .pipe(
        filter((tutor) => tutor !== null && tutor.id === id),
        takeUntil(this.destroy$),
      )
      .subscribe((tutor) => {
        if (tutor) {
          this.tutorForm.patchValue({
            nome: tutor.nome,
            email: tutor.email || '',
            telefone: tutor.telefone,
            endereco: tutor.endereco,
            cpf: tutor.cpf?.toString() || '',
          });
          if (tutor.foto) {
            this.currentPhotoUrl = tutor.foto.url;
            this.currentPhotoId = tutor.foto.id;
          }
        }
      });
  }

  onSubmit(): void {
    if (!this.tutorForm.valid) {
      this.toastService.onShowError(
        'Por favor, corrija os erros no formulário.',
      );
      this.markFormGroupTouched(this.tutorForm);
      return;
    }

    const tutorData = this.tutorForm.value;
    const message = this.isEditMode
      ? `Deseja salvar as alterações feitas em <strong>"${tutorData.nome}</strong>"?`
      : `Deseja cadastrar o tutor <strong>"${tutorData.nome}</strong>"?`;

    this.confirmService
      .openConfirm({
        title: this.isEditMode ? 'Confirmar Alterações' : 'Confirmar Cadastro',
        message: message,
      })
      .pipe(
        filter((confirmed): confirmed is boolean => confirmed === true),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        if (this.isEditMode && this.tutorId) {
          this.handleUpdate(tutorData);
        } else {
          this.handleCreate(tutorData);
        }
      });
  }

  private handleCreate(tutorData: any): void {
    this.tutoresFacade
      .createTutorWithPhoto(tutorData, this.selectedFile)
      .subscribe({
        next: () => {
          this.toastService.onShowOk('Tutor cadastrado com sucesso!');
          this.onBack();
        },
        error: (error) => {
          this.toastService.onShowError('Erro ao cadastrar tutor.', error);
        },
      });
  }

  private handleUpdate(tutorData: any): void {
    this.tutoresFacade
      .updateTutorWithPhoto(this.tutorId!, tutorData, {
        newPhoto: this.selectedFile,
        currentPhotoId: this.currentPhotoId,
        photoRemoved: this.photoRemoved,
      })
      .subscribe({
        next: () => {
          this.toastService.onShowOk('Tutor atualizado com sucesso!');
          this.onBack();
        },
        error: (error) => {
          this.toastService.onShowError('Erro ao atualizar tutor.', error);
        },
      });
  }

  onBack(): void {
    this.router.navigate(['/tutores']);
  }

  onDelete(): void {
    if (!this.tutorId) return;

    this.confirmService
      .openConfirm({
        message:
          'Tem certeza que deseja excluir este tutor? Todos os pets vinculados serão desvinculados automaticamente.',
      })
      .subscribe((result) => {
        if (result) {
          this.tutoresFacade.selectedTutor$
            .pipe(
              filter((tutor) => tutor !== null && tutor.id === this.tutorId),
              switchMap((tutor) => {
                if (tutor?.pets && tutor.pets.length > 0) {
                  const unlinkOperations = tutor.pets.map((pet) =>
                    this.tutoresFacade.unlinkPet(this.tutorId!, pet.id),
                  );
                  return forkJoin(unlinkOperations).pipe(
                    switchMap(() => of(this.tutorId!)),
                  );
                }
                return of(this.tutorId!);
              }),
              takeUntil(this.destroy$),
            )
            .subscribe({
              next: (tutorId) => {
                this.tutoresFacade.deleteTutor(tutorId);
                this.toastService.onShowOk('Tutor excluído com sucesso!');
                this.onBack();
              },
              error: (error) => {
                this.toastService.onShowError('Erro ao excluir tutor.', error);
              },
            });
        }
      });
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
    this.selectedFile = null;
    this.previewUrl = null;
    this.currentPhotoUrl = null;
    this.photoRemoved = true;
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
