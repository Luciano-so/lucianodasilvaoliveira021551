import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  DataGridComponent,
  PaginationInfo,
} from '../../../../shared/components/data-grid/data-grid.component';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { PetsFacade } from '../../facades/pets.facade';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, DataGridComponent, PetCardComponent],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss'],
})
export class PetListComponent implements OnInit, OnDestroy {
  pets: Pet[] = [];
  error: string | null = null;
  pagination: PaginationInfo = {
    page: 0,
    size: 10,
    total: 0,
    pageCount: 0,
  };

  private router = inject(Router);
  private petsFacade = inject(PetsFacade);
  private destroyRef = inject(DestroyRef);
  private searchSubject$ = new Subject<string>();

  constructor() {}

  ngOnInit(): void {
    this.setupSubscriptions();
    this.setupSearch();
    this.loadPets();
  }

  ngOnDestroy(): void {
    this.petsFacade.clearFilters();
  }

  private setupSubscriptions(): void {
    this.petsFacade.pets$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pets) => {
        this.pets = pets;
      });

    this.petsFacade.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => {
        this.error = error;
      });

    this.petsFacade.pagination$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pagination) => {
        this.pagination = pagination;
      });
  }

  private setupSearch(): void {
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((searchTerm) => {
        this.petsFacade.searchPets(searchTerm);
      });
  }

  loadPets(): void {
    this.petsFacade.loadPets();
  }

  onAddPet(): void {
    this.router.navigate(['/pets/new']);
  }

  onSearchChange(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      this.petsFacade.clearFilters();
      this.loadPets();
    } else {
      this.searchSubject$.next(searchTerm);
    }
  }

  onPageChange(page: number): void {
    this.petsFacade.goToPage(page);
  }
}
