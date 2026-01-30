import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataGridComponent } from '../../../../shared/components/data-grid/data-grid.component';
import { ListBase } from '../../../../shared/components/list-base/list-base';
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
export class PetListComponent
  extends ListBase<Pet>
  implements OnInit, OnDestroy
{
  pets: Pet[] = this.items;

  private router = inject(Router);
  private petsFacade = inject(PetsFacade);

  ngOnInit(): void {
    this.setupSubscriptions();
    this.setupSearch((term) => this.petsFacade.searchPets(term));
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

  loadPets(): void {
    this.petsFacade.loadPets();
  }

  onAddPet(): void {
    this.router.navigate(['/pets/new']);
  }

  override onSearchChange(searchTerm: string): void {
    super.onSearchChange(
      searchTerm,
      () => this.petsFacade.clearFilters(),
      () => this.loadPets(),
    );
  }

  override onPageChange(page: number): void {
    this.petsFacade.goToPage(page);
  }
}
