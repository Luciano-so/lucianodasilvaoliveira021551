import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';
import { PhotoUploadComponent } from '../../../../shared/components/photo-upload/photo-upload.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { MatErrorMessagesDirective } from '../../../../shared/directives/matErrorMessagesDirective';
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
    PhotoUploadComponent,
  ],

  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss'],
})
export class PetFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private petsFacade = inject(PetsFacade);
  private toastService = inject(ToastService);

  petForm!: FormGroup;
  isEditMode = false;
  petId?: number;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  currentPhotoUrl: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.petForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      raca: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      idade: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.petId = +id;
      this.loadPet(this.petId);
    }
  }

  private loadPet(id: number): void {
    this.petsFacade.loadPetById(id);
    this.petsFacade.selectedPet$.subscribe((pet) => {
      if (pet) {
        this.petForm.patchValue({
          nome: pet.nome,
          raca: pet.raca,
          idade: pet.idade,
        });
        if (pet.foto) {
          this.currentPhotoUrl = pet.foto.url;
        }
      }
    });
  }

  onSubmit(): void {
    if (this.petForm.valid) {
      const petData = this.petForm.value;

      if (this.isEditMode && this.petId) {
        this.petsFacade.updatePet(this.petId, petData).subscribe({
          next: (pet) => this.handlePetSave(pet, 'Pet atualizado com sucesso!'),
          error: (error) =>
            this.toastService.onShowError('Erro ao atualizar pet.', error),
        });
      } else {
        this.petsFacade.createPet(petData).subscribe({
          next: (pet) => this.handlePetSave(pet, 'Pet cadastrado com sucesso!'),
          error: (error) =>
            this.toastService.onShowError('Erro ao cadastrar pet.', error),
        });
      }
    } else {
      this.toastService.onShowError(
        'Por favor, corrija os erros no formulário.',
      );
      this.markFormGroupTouched(this.petForm);
    }
  }

  private handlePetSave(pet: any, successMessage: string): void {
    if (this.selectedFile && pet.id) {
      this.handlePhotoUpload(pet.id, successMessage);
    } else {
      this.toastService.onShowOk(successMessage);
      this.onBack();
    }
  }

  private handlePhotoUpload(petId: number, successMessage: string): void {
    this.petsFacade.uploadPhoto(petId, this.selectedFile!).subscribe({
      next: () => {
        this.toastService.onShowOk(successMessage);
        this.onBack();
      },
      error: (error) => {
        const errorMessage = this.isEditMode
          ? 'Erro ao fazer upload da foto. Pet foi atualizado.'
          : 'Pet cadastrado, mas houve erro no upload da foto.';
        this.toastService.onShowError(errorMessage, error);
        this.onBack();
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
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
