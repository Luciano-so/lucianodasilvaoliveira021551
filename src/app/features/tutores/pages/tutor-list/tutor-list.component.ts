import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataGridComponent } from '../../../../shared/components/data-grid/data-grid.component';
import { ListBase } from '../../../../shared/components/list-base/list-base';
import { TutorCardComponent } from '../../components/tutor-card/tutor-card.component';
import { TutoresFacade } from '../../facades/tutores.facade';
import { Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-tutor-list',
  standalone: true,
  imports: [CommonModule, DataGridComponent, TutorCardComponent],
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss'],
})
export class TutorListComponent
  extends ListBase<Tutor>
  implements OnInit, OnDestroy
{
  tutores: Tutor[] = this.items;

  private router = inject(Router);
  private tutoresFacade = inject(TutoresFacade);

  ngOnInit(): void {
    this.setupSubscriptions();
    this.setupSearch((term) => this.tutoresFacade.searchTutores(term));
    this.loadTutores();
  }

  ngOnDestroy(): void {
    this.tutoresFacade.clearFilters();
  }

  private setupSubscriptions(): void {
    this.tutoresFacade.tutores$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tutores) => {
        this.tutores = tutores;
      });

    this.tutoresFacade.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => {
        this.error = error;
      });

    this.tutoresFacade.pagination$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pagination) => {
        this.pagination = pagination;
      });
  }

  loadTutores(): void {
    this.tutoresFacade.loadTutores();
  }

  onAddTutor(): void {
    this.router.navigate(['/tutores/new']);
  }

  override onSearchChange(searchTerm: string): void {
    super.onSearchChange(
      searchTerm,
      () => this.tutoresFacade.clearFilters(),
      () => this.loadTutores(),
    );
  }

  override onPageChange(page: number): void {
    this.tutoresFacade.goToPage(page);
  }
}
