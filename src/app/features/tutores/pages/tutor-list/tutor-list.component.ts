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
export class TutorListComponent implements OnInit, OnDestroy {
  tutores: Tutor[] = [];
  error: string | null = null;
  pagination: PaginationInfo = {
    page: 0,
    size: 10,
    total: 0,
    pageCount: 0,
  };

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private tutoresFacade = inject(TutoresFacade);
  private searchSubject$ = new Subject<string>();

  ngOnInit(): void {
    this.setupSubscriptions();
    this.setupSearch();
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

  private setupSearch(): void {
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((searchTerm) => {
        this.tutoresFacade.searchTutores(searchTerm);
      });
  }

  loadTutores(): void {
    this.tutoresFacade.loadTutores();
  }

  onAddTutor(): void {
    this.router.navigate(['/tutores/new']);
  }

  onSearchChange(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      this.tutoresFacade.clearFilters();
      this.loadTutores();
    } else {
      this.searchSubject$.next(searchTerm);
    }
  }

  onPageChange(page: number): void {
    this.tutoresFacade.goToPage(page);
  }
}
