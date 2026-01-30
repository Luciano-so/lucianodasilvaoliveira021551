import { PETS_ROUTES } from './pets.routes';

describe('PETS_ROUTES', () => {
  it('should define routes', () => {
    expect(PETS_ROUTES).toBeDefined();
    expect(Array.isArray(PETS_ROUTES)).toBe(true);
    expect(PETS_ROUTES.length).toBe(4);
  });

  it('should have correct route paths', () => {
    const paths = PETS_ROUTES.map((route) => route.path);
    expect(paths).toEqual(['', 'new', ':id/edit', ':id']);
  });

  it('should have lazy loaded components', () => {
    PETS_ROUTES.forEach((route) => {
      expect(route.loadComponent).toBeDefined();
      expect(typeof route.loadComponent).toBe('function');
    });
  });

  it('should execute loadComponent functions', async () => {
    for (const route of PETS_ROUTES) {
      if (route.loadComponent) {
        const mod = await (route.loadComponent() as Promise<any>);
        expect(mod).toBeTruthy();
      }
    }
  }, 20000);
});
