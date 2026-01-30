import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { EntityPhotoComponent } from '../entity-photo/entity-photo.component';

export interface AutocompleteOption {
  id: number;
  label: string;
  raca?: string;
  foto?: {
    id: number;
    nome: string;
    contentType: string;
    url: string;
  };
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    EntityPhotoComponent,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() icon = '';
  @Input() required = false;
  @Input() debounceTime = 300;
  @Input() minSearchLength = 1;

  @Input() searchFn!: (query: string) => Observable<AutocompleteOption[]>;
  @Input() displayFn: (option: AutocompleteOption) => string = (option) =>
    option ? option.label : '';
  @Output() optionSelected = new EventEmitter<AutocompleteOption>();

  searchControl = new FormControl(
    '',
    this.required ? [Validators.required] : [],
  );
  private filteredOptionsSubject = new BehaviorSubject<AutocompleteOption[]>(
    [],
  );
  filteredOptions$ = this.filteredOptionsSubject.asObservable();
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        filter((value) => value != null),
        filter((value) => value.length >= this.minSearchLength),
        switchMap((query) => this.searchFn(query)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((options) => {
        this.filteredOptionsSubject.next(options);
      });
  }

  onOptionSelected(event: any): void {
    this.optionSelected.emit(event.option.value);
  }

  clear(): void {
    this.searchControl.setValue('');
    this.filteredOptionsSubject.next([]);
  }

  setValue(value: string): void {
    this.searchControl.setValue(value);
  }
}
