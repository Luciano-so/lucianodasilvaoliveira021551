import { PhoneFormatPipe } from './phone-format.pipe';

describe('PhoneFormatPipe', () => {
  let pipe: PhoneFormatPipe;

  beforeEach(() => {
    pipe = new PhoneFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should format 11-digit phone number correctly', () => {
      expect(pipe.transform('11987654321')).toBe('(11) 98765-4321');
      expect(pipe.transform(11987654321)).toBe('(11) 98765-4321');
    });

    it('should format 10-digit phone number correctly', () => {
      expect(pipe.transform('1187654321')).toBe('(11) 8765-4321');
      expect(pipe.transform(1187654321)).toBe('(11) 8765-4321');
    });

    it('should handle phone numbers with formatting', () => {
      expect(pipe.transform('(11) 98765-4321')).toBe('(11) 98765-4321');
      expect(pipe.transform('11 98765-4321')).toBe('(11) 98765-4321');
      expect(pipe.transform('11-98765-4321')).toBe('(11) 98765-4321');
    });

    it('should return unformatted number for invalid lengths', () => {
      expect(pipe.transform('123')).toBe('123');
      expect(pipe.transform('123456789')).toBe('123456789');
      expect(pipe.transform('123456789012')).toBe('123456789012');
    });

    it('should return empty string for null/undefined without showEmptyText', () => {
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
      expect(pipe.transform('')).toBe('');
    });

    it('should return "Não informado" for null/undefined with showEmptyText', () => {
      expect(pipe.transform(null, true)).toBe('Não informado');
      expect(pipe.transform(undefined, true)).toBe('Não informado');
      expect(pipe.transform('', true)).toBe('Não informado');
    });

    it('should handle different input types', () => {
      expect(pipe.transform(11987654321)).toBe('(11) 98765-4321');
      expect(pipe.transform('11987654321')).toBe('(11) 98765-4321');
    });

    it('should remove non-digit characters', () => {
      expect(pipe.transform('11a98b76c54d32e1')).toBe('(11) 98765-4321');
      expect(pipe.transform('(11) 98765-4321')).toBe('(11) 98765-4321');
    });
  });
});
