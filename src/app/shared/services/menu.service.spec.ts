import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should initialize with collapsed false', () => {
      expect(service.isCollapsed).toBe(false);
    });

    it('should initialize with default menu items', () => {
      const menuItems = service.menuItems;
      expect(menuItems).toEqual([
        { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
        { label: 'Pets', icon: 'pets', route: '/pets' },
        { label: 'Tutores', icon: 'people', route: '/tutores' },
      ]);
    });

    it('should initialize with empty active menu item', () => {
      expect(service.activeMenuItem).toBe('');
    });
  });

  describe('observables', () => {
    it('should emit initial collapsed state', (done) => {
      service.isCollapsed$.subscribe((collapsed) => {
        expect(collapsed).toBe(false);
        done();
      });
    });

    it('should emit initial menu items', (done) => {
      service.menuItems$.subscribe((items) => {
        expect(items).toEqual([
          { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
          { label: 'Pets', icon: 'pets', route: '/pets' },
          { label: 'Tutores', icon: 'people', route: '/tutores' },
        ]);
        done();
      });
    });

    it('should emit initial active menu item', (done) => {
      service.activeMenuItem$.subscribe((activeItem) => {
        expect(activeItem).toBe('');
        done();
      });
    });
  });

  describe('toggleMenu', () => {
    it('should toggle collapsed state from false to true', () => {
      service.toggleMenu();
      expect(service.isCollapsed).toBe(true);
    });

    it('should toggle collapsed state from true to false', () => {
      service.setCollapsed(true);
      service.toggleMenu();
      expect(service.isCollapsed).toBe(false);
    });

    it('should emit new collapsed state', (done) => {
      service.isCollapsed$.subscribe((collapsed) => {
        if (collapsed === true) {
          expect(collapsed).toBe(true);
          done();
        }
      });
      service.toggleMenu();
    });
  });

  describe('setCollapsed', () => {
    it('should set collapsed state to true', () => {
      service.setCollapsed(true);
      expect(service.isCollapsed).toBe(true);
    });

    it('should set collapsed state to false', () => {
      service.setCollapsed(true);
      service.setCollapsed(false);
      expect(service.isCollapsed).toBe(false);
    });

    it('should emit new collapsed state', (done) => {
      service.isCollapsed$.subscribe((collapsed) => {
        if (collapsed === true) {
          expect(collapsed).toBe(true);
          done();
        }
      });
      service.setCollapsed(true);
    });
  });

  describe('setActiveMenuItem', () => {
    it('should set active menu item', () => {
      service.setActiveMenuItem('dashboard');
      expect(service.activeMenuItem).toBe('dashboard');
    });

    it('should emit new active menu item', (done) => {
      service.activeMenuItem$.subscribe((activeItem) => {
        if (activeItem === 'pets') {
          expect(activeItem).toBe('pets');
          done();
        }
      });
      service.setActiveMenuItem('pets');
    });
  });

  describe('getters', () => {
    it('should return current collapsed state', () => {
      service.setCollapsed(true);
      expect(service.isCollapsed).toBe(true);
    });

    it('should return current menu items', () => {
      const items = service.menuItems;
      expect(items.length).toBe(3);
      expect(items[0].label).toBe('Dashboard');
    });

    it('should return current active menu item', () => {
      service.setActiveMenuItem('tutores');
      expect(service.activeMenuItem).toBe('tutores');
    });
  });
});
