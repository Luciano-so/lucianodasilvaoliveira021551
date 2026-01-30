import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginationInfo } from '../data-grid/data-grid.component';

export abstract class ListBase<T> {
  items: T[] = [];
  error: string | null = null;
  pagination: PaginationInfo = {
    page: 0,
    size: 10,
    total: 0,
    pageCount: 0,
  };

  protected destroyRef = inject(DestroyRef);
  protected searchSubject$ = new Subject<string>();

  protected setupSearch(searchCallback: (term: string) => void): void {
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((term) => searchCallback(term));
  }

  protected onSearchChange(
    searchTerm: string,
    clearFiltersFn: () => void,
    reloadFn: () => void,
  ): void {
    if (!searchTerm || searchTerm.trim() === '') {
      clearFiltersFn();
      reloadFn();
    } else {
      this.searchSubject$.next(searchTerm);
    }
  }

  protected onPageChange(page: number, goToPageFn: (p: number) => void): void {
    goToPageFn(page);
  }
}
