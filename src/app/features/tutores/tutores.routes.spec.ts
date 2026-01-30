import { TUTORES_ROUTES } from './tutores.routes';

describe('TUTORES_ROUTES', () => {
  it('should define routes', () => {
    expect(TUTORES_ROUTES).toBeDefined();
    expect(Array.isArray(TUTORES_ROUTES)).toBe(true);
    expect(TUTORES_ROUTES.length).toBe(4);
  });

  it('should have correct route paths', () => {
    const paths = TUTORES_ROUTES.map((route) => route.path);
    expect(paths).toEqual(['', 'new', ':id/edit', ':id']);
  });

  it('should have lazy loaded components', () => {
    TUTORES_ROUTES.forEach((route) => {
      expect(route.loadComponent).toBeDefined();
      expect(typeof route.loadComponent).toBe('function');
    });
  });

  it('should execute loadComponent functions', async () => {
    for (const route of TUTORES_ROUTES) {
      if (route.loadComponent) {
        const mod = await (route.loadComponent() as Promise<any>);
        expect(mod).toBeTruthy();
      }
    }
  }, 20000);
});
