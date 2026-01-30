import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import {
  AutocompleteComponent,
  AutocompleteOption,
} from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  const mockOptions: AutocompleteOption[] = [
    { id: 1, label: 'Option 1', raca: 'Breed 1' },
    { id: 2, label: 'Option 2' },
  ];

  const mockSearchFn = jasmine
    .createSpy('searchFn')
    .and.returnValue(of(mockOptions));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AutocompleteComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component.searchFn = mockSearchFn;
    // fixture.detectChanges(); // Removed to prevent automatic ngOnInit call
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.label).toBe('');
    expect(component.placeholder).toBe('');
    expect(component.icon).toBe('');
    expect(component.required).toBe(false);
    expect(component.debounceTime).toBe(300);
    expect(component.minSearchLength).toBe(1);
  });

  it('should set input properties', () => {
    component.label = 'Test Label';
    component.placeholder = 'Test Placeholder';
    component.icon = 'search';
    component.required = true;
    component.debounceTime = 500;
    component.minSearchLength = 2;

    expect(component.label).toBe('Test Label');
    expect(component.placeholder).toBe('Test Placeholder');
    component.icon = 'search';
    component.required = true;
    component.debounceTime = 500;
    component.minSearchLength = 2;

    expect(component.label).toBe('Test Label');
    expect(component.placeholder).toBe('Test Placeholder');
    expect(component.icon).toBe('search');
    expect(component.required).toBe(true);
    expect(component.debounceTime).toBe(500);
    expect(component.minSearchLength).toBe(2);
  });

  it('should call searchFn on input change after debounce', fakeAsync(() => {
    TestBed.runInInjectionContext(() => component.ngOnInit());
    component.searchControl.setValue('test');
    tick(300);
    expect(mockSearchFn).toHaveBeenCalledWith('test');
  }));

  it('should call searchFn if input length is greater than or equal to minSearchLength', fakeAsync(() => {
    component.minSearchLength = 3;
    TestBed.runInInjectionContext(() => component.ngOnInit());
    component.searchControl.setValue('tes');
    tick(300);
    expect(mockSearchFn).toHaveBeenCalled();
  }));

  it('should emit optionSelected on option selection', () => {
    spyOn(component.optionSelected, 'emit');
    const mockEvent = { option: { value: mockOptions[0] } };
    component.onOptionSelected(mockEvent as any);
    expect(component.optionSelected.emit).toHaveBeenCalledWith(mockOptions[0]);
  });

  it('should clear searchControl and filteredOptions on clear', () => {
    component.searchControl.setValue('test');
    component.clear();
    expect(component.searchControl.value).toBe('');
    component.filteredOptions$.subscribe((options) => {
      expect(options).toEqual([]);
    });
  });

  it('should set value on setValue', () => {
    component.setValue('new value');
    expect(component.searchControl.value).toBe('new value');
  });

  it('should display option label', () => {
    const result = component.displayFn(mockOptions[0]);
    expect(result).toBe('Option 1');
  });

  it('should return empty string for null option', () => {
    const result = component.displayFn(null as any);
    expect(result).toBe('');
  });
});
