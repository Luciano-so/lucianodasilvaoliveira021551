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
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';
import { PhotoUploadComponent } from '../../../../shared/components/photo-upload/photo-upload.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { MaskDirective } from '../../../../shared/directives/mask.directive';
import { MatErrorMessagesDirective } from '../../../../shared/directives/matErrorMessagesDirective';
import { cpfValidator } from '../../../../shared/validations/cpf.validation';
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
  ],
  templateUrl: './tutor-form.component.html',
  styleUrls: ['./tutor-form.component.scss'],
})
export class TutorFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tutoresFacade = inject(TutoresFacade);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  tutorForm!: FormGroup;
  isEditMode = false;
  tutorId?: number;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  currentPhotoUrl: string | null = null;
  currentPhotoId: number | null = null;
  photoRemoved: boolean = false;

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
    this.selectedFile = null;
    this.previewUrl = null;
    this.currentPhotoUrl = null;
    this.currentPhotoId = null;
    this.photoRemoved = false;
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

    if (this.isEditMode && this.tutorId) {
      this.handleUpdate(tutorData);
    } else {
      this.handleCreate(tutorData);
    }
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
