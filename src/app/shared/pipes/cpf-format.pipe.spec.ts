import { CpfFormatPipe } from './cpf-format.pipe';

describe('CpfFormatPipe', () => {
  let pipe: CpfFormatPipe;

  beforeEach(() => {
    pipe = new CpfFormatPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format CPF correctly', () => {
    expect(pipe.transform('12345678901')).toBe('123.456.789-01');
    expect(pipe.transform('123456789012')).toBe('123456789012');
  });

  it('should handle null and undefined values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(null, true)).toBe('Não informado');
    expect(pipe.transform(undefined, true)).toBe('Não informado');
  });

  it('should handle string with special characters', () => {
    expect(pipe.transform('123.456.789-01')).toBe('123.456.789-01');
    expect(pipe.transform('12345678901')).toBe('123.456.789-01');
  });
});
