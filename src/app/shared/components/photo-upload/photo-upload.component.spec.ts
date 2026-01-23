import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PhotoUploadComponent } from './photo-upload.component';

describe('PhotoUploadComponent', () => {
  let component: PhotoUploadComponent;
  let fixture: ComponentFixture<PhotoUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should accept title input', () => {
      component.title = 'Custom Title';
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('mat-card-title'));
      expect(titleElement.nativeElement.textContent.trim()).toContain(
        'Custom Title',
      );
    });

    it('should accept isEditMode input', () => {
      component.isEditMode = true;
      fixture.detectChanges();
      expect(component.isEditMode).toBe(true);
    });

    it('should accept icon input', () => {
      component.icon = 'camera';
      fixture.detectChanges();
      const iconElements = fixture.debugElement.queryAll(By.css('mat-icon'));
      expect(iconElements[0].nativeElement.textContent.trim()).toBe('camera');
    });

    it('should accept previewUrl input', () => {
      component.previewUrl = 'https://example.com/preview.jpg';
      fixture.detectChanges();
      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement.nativeElement.src).toBe(
        'https://example.com/preview.jpg',
      );
    });

    it('should accept currentPhotoUrl input', () => {
      component.currentPhotoUrl = 'https://example.com/current.jpg';
      fixture.detectChanges();
      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement.nativeElement.src).toBe(
        'https://example.com/current.jpg',
      );
    });
  });

  describe('outputs', () => {
    it('should have fileSelected output', () => {
      expect(component.fileSelected).toBeDefined();
      expect(component.fileSelected.emit).toBeDefined();
    });

    it('should have photoRemoved output', () => {
      expect(component.photoRemoved).toBeDefined();
      expect(component.photoRemoved.emit).toBeDefined();
    });
  });

  describe('onFileSelected()', () => {
    it('should emit fileSelected when file is selected', () => {
      spyOn(component.fileSelected, 'emit');
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const mockEvent = {
        target: { files: [mockFile] } as any,
      } as Event;

      component.onFileSelected(mockEvent);
      expect(component.fileSelected.emit).toHaveBeenCalledWith(mockFile);
    });

    it('should not emit when no file is selected', () => {
      spyOn(component.fileSelected, 'emit');
      const mockEvent = {
        target: { files: [] } as any,
      } as Event;

      component.onFileSelected(mockEvent);
      expect(component.fileSelected.emit).not.toHaveBeenCalled();
    });
  });

  describe('removePhoto()', () => {
    it('should emit photoRemoved', () => {
      spyOn(component.photoRemoved, 'emit');
      component.removePhoto();
      expect(component.photoRemoved.emit).toHaveBeenCalled();
    });
  });

  describe('triggerFileInput()', () => {
    it('should call click on file input', () => {
      const mockFileInput = { click: jasmine.createSpy('click') } as any;
      component.triggerFileInput(mockFileInput);
      expect(mockFileInput.click).toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    it('should show placeholder when no photo', () => {
      component.previewUrl = null;
      component.currentPhotoUrl = null;
      fixture.detectChanges();

      const placeholder = fixture.debugElement.query(
        By.css('.photo-upload__placeholder'),
      );
      expect(placeholder).toBeTruthy();
      expect(placeholder.nativeElement.textContent.trim()).toContain(
        'Nenhuma foto',
      );

      const img = fixture.debugElement.query(By.css('img'));
      expect(img).toBeFalsy();
    });

    it('should show image when previewUrl is set', () => {
      component.previewUrl = 'https://example.com/preview.jpg';
      fixture.detectChanges();

      const img = fixture.debugElement.query(By.css('img'));
      expect(img).toBeTruthy();
      expect(img.nativeElement.src).toBe('https://example.com/preview.jpg');

      const placeholder = fixture.debugElement.query(
        By.css('.photo-upload__placeholder'),
      );
      expect(placeholder).toBeFalsy();
    });

    it('should show image when currentPhotoUrl is set', () => {
      component.currentPhotoUrl = 'https://example.com/current.jpg';
      fixture.detectChanges();

      const img = fixture.debugElement.query(By.css('img'));
      expect(img).toBeTruthy();
      expect(img.nativeElement.src).toBe('https://example.com/current.jpg');
    });

    it('should show remove button when previewUrl is set', () => {
      component.previewUrl = 'https://example.com/preview.jpg';
      fixture.detectChanges();

      const removeButton = fixture.debugElement.query(
        By.css('.photo-upload__remove'),
      );
      expect(removeButton).toBeTruthy();
    });

    it('should show remove button when isEditMode and currentPhotoUrl is set', () => {
      component.isEditMode = true;
      component.currentPhotoUrl = 'https://example.com/current.jpg';
      fixture.detectChanges();

      const removeButton = fixture.debugElement.query(
        By.css('.photo-upload__remove'),
      );
      expect(removeButton).toBeTruthy();
    });

    it('should not show remove button when not in edit mode and no preview', () => {
      component.isEditMode = false;
      component.currentPhotoUrl = 'https://example.com/current.jpg';
      component.previewUrl = null;
      fixture.detectChanges();

      const removeButton = fixture.debugElement.query(
        By.css('.photo-upload__remove'),
      );
      expect(removeButton).toBeFalsy();
    });

    it('should show "Alterar Foto" button when photo exists', () => {
      component.previewUrl = 'https://example.com/preview.jpg';
      fixture.detectChanges();

      const button = fixture.debugElement.query(
        By.css('button[color="accent"]'),
      );
      expect(button.nativeElement.textContent.trim()).toContain('Alterar Foto');
    });

    it('should show "Adicionar Foto" button when no photo', () => {
      component.previewUrl = null;
      component.currentPhotoUrl = null;
      fixture.detectChanges();

      const button = fixture.debugElement.query(
        By.css('button[color="accent"]'),
      );
      expect(button.nativeElement.textContent.trim()).toContain(
        'Adicionar Foto',
      );
    });

    it('should show info message when not in edit mode and file is selected', () => {
      component.isEditMode = false;
      component.selectedFile = new File([''], 'test.jpg');
      fixture.detectChanges();

      const infoElement = fixture.debugElement.query(
        By.css('.photo-upload__info'),
      );
      expect(infoElement).toBeTruthy();
      expect(infoElement.nativeElement.textContent.trim()).toContain(
        'A foto será enviada após o cadastro',
      );
    });

    it('should not show info message in edit mode', () => {
      component.isEditMode = true;
      component.selectedFile = new File([''], 'test.jpg');
      fixture.detectChanges();

      const infoElement = fixture.debugElement.query(
        By.css('.photo-upload__info'),
      );
      expect(infoElement).toBeFalsy();
    });
  });

  describe('button interactions', () => {
    it('should call triggerFileInput when upload button is clicked', () => {
      spyOn(component, 'triggerFileInput');
      const button = fixture.debugElement.query(
        By.css('button[color="accent"]'),
      );
      button.nativeElement.click();
      expect(component.triggerFileInput).toHaveBeenCalled();
    });

    it('should call removePhoto when remove button is clicked', () => {
      component.previewUrl = 'https://example.com/preview.jpg';
      fixture.detectChanges();

      spyOn(component, 'removePhoto');
      const removeButton = fixture.debugElement.query(
        By.css('.photo-upload__remove'),
      );
      removeButton.nativeElement.click();
      expect(component.removePhoto).toHaveBeenCalled();
    });
  });

  describe('default values', () => {
    it('should have default title', () => {
      expect(component.title).toBe('Foto');
    });

    it('should have default isEditMode', () => {
      expect(component.isEditMode).toBe(false);
    });

    it('should have default icon', () => {
      expect(component.icon).toBe('photo_camera');
    });

    it('should have default previewUrl', () => {
      expect(component.previewUrl).toBe(null);
    });

    it('should have default currentPhotoUrl', () => {
      expect(component.currentPhotoUrl).toBe(null);
    });
  });
});
