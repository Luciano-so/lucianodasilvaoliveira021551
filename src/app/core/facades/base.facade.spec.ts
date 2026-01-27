import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastService } from '../../shared/components/toast/toast.service';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { BaseFacade, BaseState, ListResponse } from './base.facade';

interface TestEntity {
  id: number;
  name: string;
}

interface TestFilters {
  page?: number;
  size?: number;
  nome?: string;
}

class TestFacade extends BaseFacade<TestEntity, TestFilters> {
  constructor() {
    super();
    this.initializeState({ page: 0, size: 10 });
  }

  protected getServiceLoadMethod() {
    return (filters: TestFilters) => {
      const mockResponse: ListResponse<TestEntity> = {
        content: [
          { id: 1, name: 'Test 1' },
          { id: 2, name: 'Test 2' },
        ],
        total: 2,
        page: filters.page || 0,
        size: filters.size || 10,
        pageCount: 1,
      };
      return of(mockResponse);
    };
  }

  public testLoadItems(filters?: Partial<TestFilters>) {
    this.loadItems(this.getServiceLoadMethod(), filters, 'test entities');
  }

  public testLoadItemById(id: number) {
    this.loadItemById(() => of({ id, name: `Test ${id}` }), id, 'test entity');
  }

  public testDeleteItem(id: number) {
    this.deleteItem(() => of(void 0), id, 'test entity');
  }
}

describe('BaseFacade', () => {
  let facade: TestFacade;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const toastSpy = jasmine.createSpyObj('ToastService', [
      'onShowError',
      'onShowOk',
    ]);
    const loadingSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'close',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: ToastService, useValue: toastSpy },
        { provide: LoadingService, useValue: loadingSpy },
      ],
    });

    toastServiceSpy = TestBed.inject(
      ToastService,
    ) as jasmine.SpyObj<ToastService>;
    loadingServiceSpy = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;

    facade = TestBed.runInInjectionContext(() => new TestFacade());
  });

  it('should create', () => {
    expect(facade).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize state correctly', (done) => {
      facade.state$.subscribe((state: BaseState<TestEntity>) => {
        expect(state.items).toEqual([]);
        expect(state.selectedItem).toBeNull();
        expect(state.filters).toEqual({ page: 0, size: 10 });
        expect(state.pagination).toEqual({
          total: 0,
          page: 0,
          size: 10,
          pageCount: 0,
        });
        done();
      });
    });

    it('should provide items$ observable', (done) => {
      facade.items$.subscribe((items) => {
        expect(items).toEqual([]);
        done();
      });
    });

    it('should provide selectedItem$ observable', (done) => {
      facade.selectedItem$.subscribe((selectedItem) => {
        expect(selectedItem).toBeNull();
        done();
      });
    });

    it('should provide pagination$ observable', (done) => {
      facade.pagination$.subscribe((pagination) => {
        expect(pagination).toEqual({
          total: 0,
          page: 0,
          size: 10,
          pageCount: 0,
        });
        done();
      });
    });

    it('should provide error$ observable', (done) => {
      facade.error$.subscribe((error) => {
        expect(error).toBeNull();
        done();
      });
    });
  });

  describe('loadItems', () => {
    it('should load items successfully', (done) => {
      facade.testLoadItems();

      setTimeout(() => {
        facade.items$.subscribe((items) => {
          expect(items).toEqual([
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' },
          ]);
          done();
        });
      }, 100);
    });

    it('should update pagination when loading items', (done) => {
      facade.testLoadItems();

      setTimeout(() => {
        facade.pagination$.subscribe((pagination) => {
          expect(pagination).toEqual({
            total: 2,
            page: 0,
            size: 10,
            pageCount: 1,
          });
          done();
        });
      }, 100);
    });

    it('should handle load items error', (done) => {
      class ErrorFacade extends BaseFacade<TestEntity, TestFilters> {
        constructor() {
          super();
          this.initializeState({ page: 0, size: 10 });
        }

        protected getServiceLoadMethod() {
          return () => throwError(() => new Error('Test error'));
        }

        public testLoadItems() {
          this.loadItems(this.getServiceLoadMethod(), {}, 'test entities');
        }
      }

      const errorFacade = TestBed.runInInjectionContext(
        () => new ErrorFacade(),
      );

      errorFacade.testLoadItems();

      setTimeout(() => {
        errorFacade.error$.subscribe((error) => {
          expect(error).toBe('Test error');
          done();
        });
      }, 100);
    });
  });

  describe('loadItemById', () => {
    it('should load item by id successfully', (done) => {
      facade.testLoadItemById(1);

      setTimeout(() => {
        facade.selectedItem$.subscribe((selectedItem) => {
          expect(selectedItem).toEqual({ id: 1, name: 'Test 1' });
          done();
        });
      }, 100);
    });

    it('should handle load item by id error', (done) => {
      class ErrorFacade extends BaseFacade<TestEntity, TestFilters> {
        constructor() {
          super();
          this.initializeState({ page: 0, size: 10 });
        }

        protected getServiceLoadMethod() {
          return () => of({} as ListResponse<TestEntity>);
        }

        public testLoadItemById(id: number) {
          this.loadItemById(
            () => throwError(() => new Error('Load error')),
            id,
            'test entity',
          );
        }
      }

      const errorFacade = TestBed.runInInjectionContext(
        () => new ErrorFacade(),
      );
      errorFacade.testLoadItemById(1);

      setTimeout(() => {
        errorFacade.error$.subscribe((error) => {
          expect(error).toBe('Load error');
          done();
        });
      }, 100);
    });
  });

  describe('deleteItem', () => {
    it('should delete item successfully', (done) => {
      facade.testDeleteItem(1);

      expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith(
        'test entity removido com sucesso!',
      );

      done();
    });

    it('should handle delete item error', (done) => {
      class ErrorFacade extends BaseFacade<TestEntity, TestFilters> {
        constructor() {
          super();
          this.initializeState({ page: 0, size: 10 });
        }

        protected getServiceLoadMethod() {
          return () => of({} as ListResponse<TestEntity>);
        }

        public testDeleteItem(id: number) {
          this.deleteItem(
            () => throwError(() => new Error('Delete error')),
            id,
            'test entity',
          );
        }
      }

      const errorFacade = TestBed.runInInjectionContext(
        () => new ErrorFacade(),
      );
      errorFacade.testDeleteItem(1);

      setTimeout(() => {
        errorFacade.error$.subscribe((error) => {
          expect(error).toBe('Delete error');
          done();
        });
      }, 100);
    });
  });

  describe('search', () => {
    it('should search items', (done) => {
      spyOn<any>(facade, 'loadItems');

      facade.search('test search');

      expect(facade['loadItems']).toHaveBeenCalledWith(jasmine.any(Function), {
        page: 0,
        size: 10,
        nome: 'test search',
      });

      done();
    });
  });

  describe('clearFilters', () => {
    it('should clear filters', (done) => {
      facade.testLoadItems({ page: 2, size: 20, nome: 'test' });

      setTimeout(() => {
        facade.clearFilters();

        facade.state$.subscribe((state) => {
          expect(state.filters).toEqual({
            page: 0,
            size: 10,
          });
          done();
        });
      }, 100);
    });
  });

  describe('goToPage', () => {
    it('should go to specific page', (done) => {
      spyOn<any>(facade, 'loadItems');

      facade.goToPage(5);

      expect(facade['loadItems']).toHaveBeenCalledWith(jasmine.any(Function), {
        page: 5,
        size: 10,
      });

      done();
    });
  });

  describe('clearError', () => {
    it('should clear error', (done) => {
      (facade as any)._error$.next('Test error');

      facade.clearError();

      facade.error$.subscribe((error) => {
        expect(error).toBeNull();
        done();
      });
    });
  });
});
