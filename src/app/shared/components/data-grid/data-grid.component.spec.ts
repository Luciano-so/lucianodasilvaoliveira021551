import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DataGridComponent, PaginationInfo } from './data-grid.component';

describe('DataGridComponent', () => {
  let component: DataGridComponent<any>;
  let fixture: ComponentFixture<DataGridComponent<any>>;

  const mockItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];

  const mockPagination: PaginationInfo = {
    page: 0,
    size: 10,
    total: 25,
    pageCount: 3,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should accept title input', () => {
      component.title = 'Test Title';
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(
        By.css('.data-grid__title'),
      );
      expect(titleElement.nativeElement.textContent.trim()).toBe('Test Title');
    });

    it('should accept items input', () => {
      component.items = mockItems;
      fixture.detectChanges();
      expect(component.items).toEqual(mockItems);
    });

    it('should accept pagination input', () => {
      component.pagination = mockPagination;
      fixture.detectChanges();
      expect(component.pagination).toEqual(mockPagination);
    });

    it('should accept showSearch input', () => {
      component.showSearch = false;
      fixture.detectChanges();
      const searchElement = fixture.debugElement.query(
        By.css('.data-grid__search'),
      );
      expect(searchElement).toBeFalsy();
    });

    it('should accept showAddButton input', () => {
      component.showAddButton = false;
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(
        By.css('.data-grid__add-btn'),
      );
      expect(addButton).toBeFalsy();
    });

    it('should accept addButtonText input', () => {
      component.addButtonText = 'Add New';
      component.showAddButton = true;
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(
        By.css('.data-grid__add-btn'),
      );
      expect(addButton.nativeElement.textContent.trim()).toContain('Add New');
    });

    it('should accept searchPlaceholder input', () => {
      component.searchPlaceholder = 'Search items...';
      component.showSearch = true;
      fixture.detectChanges();
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement.nativeElement.placeholder).toBe('Search items...');
    });

    it('should accept emptyMessage input', () => {
      component.items = [];
      component.emptyMessage = 'No data found';
      fixture.detectChanges();
      const emptyElement = fixture.debugElement.query(
        By.css('.data-grid__empty p'),
      );
      expect(emptyElement.nativeElement.textContent.trim()).toBe(
        'No data found',
      );
    });
  });

  describe('outputs', () => {
    it('should emit retry event on onRetry', () => {
      spyOn(component.retry, 'emit');
      component.onRetry();
      expect(component.retry.emit).toHaveBeenCalled();
    });

    it('should emit addClick event on onAddClick', () => {
      spyOn(component.addClick, 'emit');
      component.onAddClick();
      expect(component.addClick.emit).toHaveBeenCalled();
    });

    it('should emit pageChange event on onPageChange', () => {
      spyOn(component.pageChange, 'emit');
      component.pagination = { page: 0, size: 10, total: 50, pageCount: 5 };
      component.onPageChange(1);
      expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    });

    it('should emit searchChange event on onSearchInput', () => {
      spyOn(component.searchChange, 'emit');
      const mockEvent = { target: { value: 'test search' } } as any;
      component.onSearchInput(mockEvent);
      expect(component.searchChange.emit).toHaveBeenCalledWith('test search');
    });
  });

  describe('onSearchInput', () => {
    it('should update searchTerm and emit searchChange', () => {
      spyOn(component.searchChange, 'emit');
      const mockEvent = { target: { value: 'new search' } } as any;
      component.onSearchInput(mockEvent);
      expect(component.searchTerm).toBe('new search');
      expect(component.searchChange.emit).toHaveBeenCalledWith('new search');
    });
  });

  describe('onPageChange', () => {
    it('should emit pageChange for valid page', () => {
      spyOn(component.pageChange, 'emit');
      component.pagination = mockPagination;
      component.onPageChange(1);
      expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    });

    it('should not emit pageChange for invalid page (negative)', () => {
      spyOn(component.pageChange, 'emit');
      component.pagination = mockPagination;
      component.onPageChange(-1);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should not emit pageChange for invalid page (too high)', () => {
      spyOn(component.pageChange, 'emit');
      component.pagination = mockPagination;
      component.onPageChange(10);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('getPaginationArray', () => {
    it('should return correct pagination array for middle page', () => {
      component.pagination = { ...mockPagination, page: 1, pageCount: 10 };
      const result = component.getPaginationArray();
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    it('should return correct pagination array for first page', () => {
      component.pagination = { ...mockPagination, page: 0, pageCount: 10 };
      const result = component.getPaginationArray();
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    it('should return correct pagination array for last page', () => {
      component.pagination = { ...mockPagination, page: 9, pageCount: 10 };
      const result = component.getPaginationArray();
      expect(result).toEqual([5, 6, 7, 8, 9]);
    });

    it('should handle small page count', () => {
      component.pagination = { ...mockPagination, page: 0, pageCount: 3 };
      const result = component.getPaginationArray();
      expect(result).toEqual([0, 1, 2]);
    });
  });

  describe('getPageDisplay', () => {
    it('should return page + 1', () => {
      expect(component.getPageDisplay(0)).toBe(1);
      expect(component.getPageDisplay(1)).toBe(2);
      expect(component.getPageDisplay(5)).toBe(6);
    });
  });

  describe('template rendering', () => {
    it('should show error state when error is present', () => {
      component.error = 'Test error';
      component.items = [];
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(
        By.css('.data-grid__error'),
      );
      expect(errorElement).toBeTruthy();

      const gridElement = fixture.debugElement.query(
        By.css('.data-grid__grid'),
      );
      expect(gridElement).toBeFalsy();

      const emptyElement = fixture.debugElement.query(
        By.css('.data-grid__empty'),
      );
      expect(emptyElement).toBeFalsy();
    });

    it('should show empty state when no items and no error', () => {
      component.items = [];
      component.error = null;
      component.emptyMessage = 'No items';
      fixture.detectChanges();

      const emptyElement = fixture.debugElement.query(
        By.css('.data-grid__empty'),
      );
      expect(emptyElement).toBeTruthy();
      expect(emptyElement.nativeElement.textContent).toContain('No items');

      const gridElement = fixture.debugElement.query(
        By.css('.data-grid__grid'),
      );
      expect(gridElement).toBeFalsy();

      const errorElement = fixture.debugElement.query(
        By.css('.data-grid__error'),
      );
      expect(errorElement).toBeFalsy();
    });

    it('should show grid when items are present', () => {
      component.items = mockItems;
      component.error = null;
      fixture.detectChanges();

      const gridElement = fixture.debugElement.query(
        By.css('.data-grid__grid'),
      );
      expect(gridElement).toBeTruthy();

      const emptyElement = fixture.debugElement.query(
        By.css('.data-grid__empty'),
      );
      expect(emptyElement).toBeFalsy();

      const errorElement = fixture.debugElement.query(
        By.css('.data-grid__error'),
      );
      expect(errorElement).toBeFalsy();
    });

    it('should show pagination when pageCount > 1', () => {
      component.pagination = mockPagination;
      component.items = mockItems;
      fixture.detectChanges();

      const paginationElement = fixture.debugElement.query(
        By.css('.data-grid__pagination'),
      );
      expect(paginationElement).toBeTruthy();
    });

    it('should hide pagination when pageCount <= 1', () => {
      component.pagination = { ...mockPagination, pageCount: 1 };
      component.items = mockItems;
      fixture.detectChanges();

      const paginationElement = fixture.debugElement.query(
        By.css('.data-grid__pagination'),
      );
      expect(paginationElement).toBeFalsy();
    });

    it('should show search when showSearch is true', () => {
      component.showSearch = true;
      fixture.detectChanges();

      const searchElement = fixture.debugElement.query(
        By.css('.data-grid__search'),
      );
      expect(searchElement).toBeTruthy();
    });

    it('should hide search when showSearch is false', () => {
      component.showSearch = false;
      fixture.detectChanges();

      const searchElement = fixture.debugElement.query(
        By.css('.data-grid__search'),
      );
      expect(searchElement).toBeFalsy();
    });

    it('should show add button when showAddButton is true', () => {
      component.showAddButton = true;
      fixture.detectChanges();

      const addButton = fixture.debugElement.query(
        By.css('.data-grid__add-btn'),
      );
      expect(addButton).toBeTruthy();
    });

    it('should hide add button when showAddButton is false', () => {
      component.showAddButton = false;
      fixture.detectChanges();

      const addButton = fixture.debugElement.query(
        By.css('.data-grid__add-btn'),
      );
      expect(addButton).toBeFalsy();
    });

    it('should show clear search button when searchTerm is not empty', () => {
      component.showSearch = true;
      component.searchTerm = 'test';
      fixture.detectChanges();

      const clearButton = fixture.debugElement.query(
        By.css('button[matIconSuffix]'),
      );
      expect(clearButton).toBeTruthy();
    });

    it('should hide clear search button when searchTerm is empty', () => {
      component.showSearch = true;
      component.searchTerm = '';
      fixture.detectChanges();

      const clearButton = fixture.debugElement.query(
        By.css('button[matIconSuffix]'),
      );
      expect(clearButton).toBeFalsy();
    });
  });

  describe('event handlers', () => {
    it('should call onRetry when retry button is clicked', () => {
      spyOn(component, 'onRetry');
      component.error = 'error';
      fixture.detectChanges();

      const retryButton = fixture.debugElement.query(
        By.css('.data-grid__error button'),
      );
      retryButton.nativeElement.click();

      expect(component.onRetry).toHaveBeenCalled();
    });

    it('should call onAddClick when add button is clicked', () => {
      spyOn(component, 'onAddClick');
      component.showAddButton = true;
      fixture.detectChanges();

      const addButton = fixture.debugElement.query(
        By.css('.data-grid__add-btn'),
      );
      addButton.nativeElement.click();

      expect(component.onAddClick).toHaveBeenCalled();
    });

    it('should call onPageChange when pagination button is clicked', () => {
      spyOn(component, 'onPageChange');
      component.pagination = mockPagination;
      component.items = mockItems;
      fixture.detectChanges();

      const pageButtons = fixture.debugElement.queryAll(
        By.css('.data-grid__pagination button'),
      );
      const page2Button = pageButtons.find(
        (btn) => btn.nativeElement.textContent.trim() === '2',
      );
      if (page2Button) {
        page2Button.nativeElement.click();
        expect(component.onPageChange).toHaveBeenCalledWith(1);
      }
    });
  });
});
