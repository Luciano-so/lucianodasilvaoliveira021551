import { AgeFormatPipe } from './age-format.pipe';

describe('AgeFormatPipe', () => {
  let pipe: AgeFormatPipe;

  beforeEach(() => {
    pipe = new AgeFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return empty string for null age when showEmptyText is false', () => {
      const result = pipe.transform(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined age when showEmptyText is false', () => {
      const result = pipe.transform(undefined);
      expect(result).toBe('');
    });

    it('should return "Não informada" for null age when showEmptyText is true', () => {
      const result = pipe.transform(null, true);
      expect(result).toBe('Não informada');
    });

    it('should return "Não informada" for undefined age when showEmptyText is true', () => {
      const result = pipe.transform(undefined, true);
      expect(result).toBe('Não informada');
    });

    it('should return "1 ano" for age 1', () => {
      const result = pipe.transform(1);
      expect(result).toBe('1 ano');
    });

    it('should return "2 anos" for age 2', () => {
      const result = pipe.transform(2);
      expect(result).toBe('2 anos');
    });

    it('should return "10 anos" for age 10', () => {
      const result = pipe.transform(10);
      expect(result).toBe('10 anos');
    });

    it('should return "0 anos" for age 0', () => {
      const result = pipe.transform(0);
      expect(result).toBe('0 anos');
    });

    it('should handle negative ages', () => {
      const result = pipe.transform(-5);
      expect(result).toBe('-5 anos');
    });
  });
});
