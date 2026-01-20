import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

export interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  pageCount: number;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
})
export class DataGridComponent<T> {
  @Input() title = '';
  @Input() items: T[] = [];
  @Input() error: string | null = null;
  @Input() pagination: PaginationInfo = {
    page: 0,
    size: 10,
    total: 0,
    pageCount: 0,
  };
  @Input() searchPlaceholder = 'Buscar...';
  @Input() addButtonText = 'Adicionar';
  @Input() addButtonRoute = '';
  @Input() emptyMessage = 'Nenhum item encontrado';
  @Input() addFirstItemText = 'Adicionar Primeiro Item';
  @Input() showAddButton = true;
  @Input() showSearch = true;

  @Output() searchChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() retry = new EventEmitter<void>();

  @ContentChild('cardTemplate') cardTemplate!: TemplateRef<any>;

  searchTerm = '';

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.searchChange.emit(value);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.pagination.pageCount) {
      this.pageChange.emit(page);
    }
  }

  onRetry(): void {
    this.retry.emit();
  }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const currentPage = this.pagination.page;
    const pageCount = this.pagination.pageCount;

    let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(pageCount - 1, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getPageDisplay(page: number): number {
    return page + 1;
  }
}
