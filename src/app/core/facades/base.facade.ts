import { inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ToastService } from '../../shared/components/toast/toast.service';

export interface BaseState<T> {
  items: T[];
  selectedItem: T | null;
  filters: any;
  pagination: {
    total: number;
    page: number;
    size: number;
    pageCount: number;
  };
}

export interface ListResponse<T> {
  content: T[];
  total: number;
  page: number;
  size: number;
  pageCount: number;
}

export abstract class BaseFacade<
  T,
  TFilters extends { page?: number; size?: number },
> {
  protected _state$!: BehaviorSubject<BaseState<T>>;
  private _error$ = new BehaviorSubject<string | null>(null);

  public state$!: Observable<BaseState<T>>;
  public items$!: Observable<T[]>;
  public error$ = this._error$.asObservable();
  public selectedItem$!: Observable<T | null>;
  public pagination$!: Observable<BaseState<T>['pagination']>;

  protected toastService = inject(ToastService);

  protected initializeState(initialFilters: TFilters): void {
    this._state$ = new BehaviorSubject<BaseState<T>>({
      items: [],
      selectedItem: null,
      filters: initialFilters,
      pagination: {
        total: 0,
        page: 0,
        size: 10,
        pageCount: 0,
      },
    });

    this.state$ = this._state$.asObservable();
    this.items$ = this._state$.pipe(map((state) => state.items));
    this.selectedItem$ = this._state$.pipe(map((state) => state.selectedItem));
    this.pagination$ = this._state$.pipe(map((state) => state.pagination));
  }

  protected loadItems(
    serviceCall: (filters: TFilters) => Observable<ListResponse<T>>,
    filters?: Partial<TFilters>,
    entityName: string = 'itens',
  ): void {
    const currentState = this._state$.value;
    const appliedFilters = { ...currentState.filters, ...filters } as TFilters;

    this.updateState({ filters: appliedFilters });
    this._error$.next(null);

    serviceCall(appliedFilters)
      .pipe(
        tap((response: ListResponse<T>) => {
          this.updateState({
            items: response.content,
            pagination: {
              total: response.total,
              page: response.page,
              size: response.size,
              pageCount: response.pageCount,
            },
          });
        }),
      )
      .subscribe({
        error: (error) => {
          const errorMessage =
            error?.message || `Erro ao carregar ${entityName}`;
          this._error$.next(errorMessage);
        },
      });
  }

  protected loadItemById(
    serviceCall: (id: number) => Observable<T>,
    id: number,
    entityName: string = 'item',
  ): void {
    this.updateState({ selectedItem: null });

    serviceCall(id)
      .pipe(tap((item: T) => this.updateState({ selectedItem: item })))
      .subscribe({
        error: (error) => {
          const errorMessage =
            error?.message || `Erro ao carregar ${entityName}`;
          this._error$.next(errorMessage);
        },
      });
  }

  protected deleteItem(
    serviceCall: (id: number) => Observable<void>,
    id: number,
    entityName: string = 'item',
  ): void {
    serviceCall(id)
      .pipe(
        tap(() =>
          this.toastService.onShowOk(`${entityName} removido com sucesso!`),
        ),
      )
      .subscribe({
        error: (error) => {
          const errorMessage =
            error?.message || `Erro ao remover ${entityName}`;
          this._error$.next(errorMessage);
        },
      });
  }

  public search(searchTerm: string): void {
    const currentFilters = this._state$.value.filters;
    this.loadItems(this.getServiceLoadMethod(), {
      ...currentFilters,
      nome: searchTerm,
      page: 0,
    } as Partial<TFilters>);
  }

  public clearFilters(): void {
    this.updateState({
      filters: {
        page: 0,
        size: 10,
      } as TFilters,
    });
  }

  public goToPage(page: number): void {
    const currentFilters = this._state$.value.filters;
    this.loadItems(this.getServiceLoadMethod(), {
      ...currentFilters,
      page,
    } as Partial<TFilters>);
  }

  public clearError(): void {
    this._error$.next(null);
  }

  protected updateState(partialState: Partial<BaseState<T>>): void {
    const currentState = this._state$.value;
    this._state$.next({ ...currentState, ...partialState });
  }

  protected abstract getServiceLoadMethod(): (
    filters: TFilters,
  ) => Observable<ListResponse<T>>;
}
