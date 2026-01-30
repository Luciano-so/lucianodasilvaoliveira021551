import { routes } from './app.routes';

describe('App Routes', () => {
  it('should have routes defined', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });

  describe('login route', () => {
    const loginRoute = routes.find((route) => route.path === 'login');

    it('should have login route', () => {
      expect(loginRoute).toBeDefined();
    });

    it('should have loadComponent for login', () => {
      expect(loginRoute?.loadComponent).toBeDefined();
      expect(typeof loginRoute?.loadComponent).toBe('function');
    });

    it('should not have canActivate for login', () => {
      expect(loginRoute?.canActivate).toBeUndefined();
    });
  });

  describe('dashboard route', () => {
    const dashboardRoute = routes.find((route) => route.path === 'dashboard');

    it('should have dashboard route', () => {
      expect(dashboardRoute).toBeDefined();
    });

    it('should have loadComponent for dashboard', () => {
      expect(dashboardRoute?.loadComponent).toBeDefined();
      expect(typeof dashboardRoute?.loadComponent).toBe('function');
    });

    it('should have authGuard for dashboard', () => {
      expect(dashboardRoute?.canActivate).toBeDefined();
      expect(Array.isArray(dashboardRoute?.canActivate)).toBe(true);
      expect(dashboardRoute?.canActivate?.length).toBe(1);
    });
  });

  describe('pets route', () => {
    const petsRoute = routes.find((route) => route.path === 'pets');

    it('should have pets route', () => {
      expect(petsRoute).toBeDefined();
    });

    it('should have loadChildren for pets', () => {
      expect(petsRoute?.loadChildren).toBeDefined();
      expect(typeof petsRoute?.loadChildren).toBe('function');
    });

    it('should have authGuard for pets', () => {
      expect(petsRoute?.canActivate).toBeDefined();
      expect(Array.isArray(petsRoute?.canActivate)).toBe(true);
      expect(petsRoute?.canActivate?.length).toBe(1);
    });
  });

  describe('tutores route', () => {
    const tutoresRoute = routes.find((route) => route.path === 'tutores');

    it('should have tutores route', () => {
      expect(tutoresRoute).toBeDefined();
    });

    it('should have loadChildren for tutores', () => {
      expect(tutoresRoute?.loadChildren).toBeDefined();
      expect(typeof tutoresRoute?.loadChildren).toBe('function');
    });

    it('should have authGuard for tutores', () => {
      expect(tutoresRoute?.canActivate).toBeDefined();
      expect(Array.isArray(tutoresRoute?.canActivate)).toBe(true);
      expect(tutoresRoute?.canActivate?.length).toBe(1);
    });
  });

  describe('default route', () => {
    const defaultRoute = routes.find((route) => route.path === '');

    it('should have default route', () => {
      expect(defaultRoute).toBeDefined();
    });

    it('should redirect to login', () => {
      expect(defaultRoute?.redirectTo).toBe('/login');
      expect(defaultRoute?.pathMatch).toBe('full');
    });
  });

  describe('wildcard route', () => {
    const wildcardRoute = routes.find((route) => route.path === '**');

    it('should have wildcard route', () => {
      expect(wildcardRoute).toBeDefined();
    });

    it('should redirect to dashboard', () => {
      expect(wildcardRoute?.redirectTo).toBe('/dashboard');
    });
  });

  describe('route structure', () => {
    it('should have correct number of routes', () => {
      expect(routes.length).toBe(6);
    });

    it('should have all required route properties', () => {
      routes.forEach((route) => {
        expect(route).toBeDefined();
        expect(typeof route.path).toBe('string');
      });
    });
  });

  it('should execute lazy loaders to increase coverage', async () => {
    for (const route of routes) {
      if (route.loadComponent) {
        const mod = await (route.loadComponent() as Promise<any>);
        expect(mod).toBeTruthy();
      }
      if (route.loadChildren) {
        const mod = await (route.loadChildren() as Promise<any>);
        expect(mod).toBeTruthy();
      }
    }
  }, 20000);
});
