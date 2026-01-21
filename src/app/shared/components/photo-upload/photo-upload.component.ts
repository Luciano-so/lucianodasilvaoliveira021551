import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-photo-upload',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss'],
})
export class PhotoUploadComponent {
  @Input() title: string = 'Foto';
  @Input() icon: string = 'photo_camera';
  @Input() previewUrl: string | null = null;
  @Input() currentPhotoUrl: string | null = null;
  @Input() isEditMode: boolean = false;
  @Input() selectedFile: File | null = null;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() photoRemoved = new EventEmitter<void>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileSelected.emit(file);
    }
  }

  removePhoto(): void {
    this.photoRemoved.emit();
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
}
