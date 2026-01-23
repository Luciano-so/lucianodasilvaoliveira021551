import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RelationSectionComponent } from './relation-section.component';

describe('RelationSectionComponent', () => {
  let component: RelationSectionComponent;
  let fixture: ComponentFixture<RelationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelationSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should accept noticeText input', () => {
      component.noticeText = 'Test notice text';
      fixture.detectChanges();
      expect(component.noticeText).toBe('Test notice text');
    });

    it('should accept noticeIcon input', () => {
      component.noticeIcon = 'info';
      fixture.detectChanges();
      expect(component.noticeIcon).toBe('info');
    });

    it('should accept noticeTitle input', () => {
      component.noticeTitle = 'Test Title';
      fixture.detectChanges();
      expect(component.noticeTitle).toBe('Test Title');
    });

    it('should accept isEditMode input', () => {
      component.isEditMode = true;
      fixture.detectChanges();
      expect(component.isEditMode).toBe(true);
    });

    it('should accept entityId input', () => {
      component.entityId = 123;
      fixture.detectChanges();
      expect(component.entityId).toBe(123);
    });

    it('should accept linkTemplate input', () => {
      const mockTemplate = {} as TemplateRef<any>;
      component.linkTemplate = mockTemplate;
      fixture.detectChanges();
      expect(component.linkTemplate).toBe(mockTemplate);
    });
  });

  describe('template rendering', () => {
    it('should show notice card when not in edit mode', () => {
      component.isEditMode = false;
      component.noticeTitle = 'Notice Title';
      component.noticeText = 'Notice text';
      component.noticeIcon = 'info';
      fixture.detectChanges();

      const noticeCard = fixture.debugElement.query(
        By.css('.relation-section__notice'),
      );
      expect(noticeCard).toBeTruthy();

      const titleElement = fixture.debugElement.query(By.css('mat-card-title'));
      expect(titleElement.nativeElement.textContent.trim()).toContain(
        'Notice Title',
      );

      const contentElement = fixture.debugElement.query(
        By.css('mat-card-content p'),
      );
      expect(contentElement.nativeElement.textContent.trim()).toBe(
        'Notice text',
      );

      const iconElement = fixture.debugElement.query(By.css('mat-icon'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('info');
    });

    it('should show notice card when in edit mode but no entityId', () => {
      component.isEditMode = true;
      component.entityId = undefined;
      component.noticeTitle = 'Notice Title';
      fixture.detectChanges();

      const noticeCard = fixture.debugElement.query(
        By.css('.relation-section__notice'),
      );
      expect(noticeCard).toBeTruthy();
    });

    it('should show notice card when in edit mode but no linkTemplate', () => {
      component.isEditMode = true;
      component.entityId = 123;
      component.linkTemplate = undefined;
      component.noticeTitle = 'Notice Title';
      fixture.detectChanges();

      const noticeCard = fixture.debugElement.query(
        By.css('.relation-section__notice'),
      );
      expect(noticeCard).toBeTruthy();
    });

    it('should render notice card content correctly', () => {
      component.isEditMode = false;
      component.noticeTitle = 'Test Notice';
      component.noticeText = 'This is a test notice';
      component.noticeIcon = 'warning';
      fixture.detectChanges();

      const card = fixture.debugElement.query(By.css('mat-card'));
      expect(card).toBeTruthy();

      const title = fixture.debugElement.query(By.css('mat-card-title'));
      expect(title.nativeElement.textContent.trim()).toContain('Test Notice');

      const content = fixture.debugElement.query(By.css('mat-card-content p'));
      expect(content.nativeElement.textContent.trim()).toBe(
        'This is a test notice',
      );

      const icon = fixture.debugElement.query(By.css('mat-icon'));
      expect(icon.nativeElement.textContent.trim()).toBe('warning');
    });
  });

  describe('default values', () => {
    it('should have default noticeText', () => {
      expect(component.noticeText).toBe('');
    });

    it('should have default noticeIcon', () => {
      expect(component.noticeIcon).toBe('');
    });

    it('should have default noticeTitle', () => {
      expect(component.noticeTitle).toBe('');
    });

    it('should have default isEditMode', () => {
      expect(component.isEditMode).toBe(false);
    });

    it('should have default entityId', () => {
      expect(component.entityId).toBeUndefined();
    });

    it('should have default linkTemplate', () => {
      expect(component.linkTemplate).toBeUndefined();
    });
  });
});
