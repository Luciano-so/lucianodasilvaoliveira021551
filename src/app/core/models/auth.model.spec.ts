import { AuthResponse, LoginRequest, User } from './auth.model';

describe('Auth Models', () => {
  describe('LoginRequest interface', () => {
    it('should create a valid LoginRequest object', () => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'password123',
      };

      expect(loginRequest.username).toBe('admin');
      expect(loginRequest.password).toBe('password123');
    });

    it('should allow LoginRequest with all required properties', () => {
      const loginRequest: LoginRequest = {
        username: 'user@example.com',
        password: 'securePass123',
      };

      expect(loginRequest).toBeDefined();
      expect(typeof loginRequest.username).toBe('string');
      expect(typeof loginRequest.password).toBe('string');
    });
  });

  describe('AuthResponse interface', () => {
    it('should create a valid AuthResponse object', () => {
      const authResponse: AuthResponse = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'refresh_token_here',
        expires_in: 3600,
        refresh_expires_in: 86400,
      };

      expect(authResponse.access_token).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      );
      expect(authResponse.refresh_token).toBe('refresh_token_here');
      expect(authResponse.expires_in).toBe(3600);
      expect(authResponse.refresh_expires_in).toBe(86400);
    });

    it('should allow AuthResponse with all required properties', () => {
      const authResponse: AuthResponse = {
        access_token: 'token123',
        refresh_token: 'refresh123',
        expires_in: 7200,
        refresh_expires_in: 604800,
      };

      expect(authResponse).toBeDefined();
      expect(typeof authResponse.access_token).toBe('string');
      expect(typeof authResponse.refresh_token).toBe('string');
      expect(typeof authResponse.expires_in).toBe('number');
      expect(typeof authResponse.refresh_expires_in).toBe('number');
    });
  });

  describe('User interface', () => {
    it('should create a valid User object', () => {
      const user: User = {
        username: 'admin',
        accessToken: 'access_token_here',
        refreshToken: 'refresh_token_here',
      };

      expect(user.username).toBe('admin');
      expect(user.accessToken).toBe('access_token_here');
      expect(user.refreshToken).toBe('refresh_token_here');
    });

    it('should allow User with all required properties', () => {
      const user: User = {
        username: 'user@example.com',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'refresh_token_123',
      };

      expect(user).toBeDefined();
      expect(typeof user.username).toBe('string');
      expect(typeof user.accessToken).toBe('string');
      expect(typeof user.refreshToken).toBe('string');
    });
  });
});
