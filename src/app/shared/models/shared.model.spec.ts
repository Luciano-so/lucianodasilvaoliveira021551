import { LoadingState, MenuItem } from './shared.model';

describe('Shared Models', () => {
  describe('MenuItem interface', () => {
    it('should create a valid MenuItem object', () => {
      const menuItem: MenuItem = {
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard',
      };

      expect(menuItem.label).toBe('Dashboard');
      expect(menuItem.icon).toBe('dashboard');
      expect(menuItem.route).toBe('/dashboard');
    });

    it('should allow MenuItem with all required properties', () => {
      const menuItem: MenuItem = {
        label: 'Pets',
        icon: 'pets',
        route: '/pets',
      };

      expect(menuItem).toBeDefined();
      expect(typeof menuItem.label).toBe('string');
      expect(typeof menuItem.icon).toBe('string');
      expect(typeof menuItem.route).toBe('string');
    });
  });

  describe('LoadingState interface', () => {
    it('should create a valid LoadingState object with message', () => {
      const loadingState: LoadingState = {
        show: true,
        message: 'Loading data...',
      };

      expect(loadingState.show).toBe(true);
      expect(loadingState.message).toBe('Loading data...');
    });

    it('should create a valid LoadingState object without message', () => {
      const loadingState: LoadingState = {
        show: false,
      };

      expect(loadingState.show).toBe(false);
      expect(loadingState.message).toBeUndefined();
    });

    it('should allow LoadingState with show property only', () => {
      const loadingState: LoadingState = {
        show: true,
      };

      expect(loadingState.show).toBe(true);
      expect(loadingState.message).toBeUndefined();
    });
  });
});
