import { FormControl } from '@angular/forms';
import { cpfValidator } from './cpf.validation';

describe('cpfValidator', () => {
  it('should return null for valid CPF without formatting', () => {
    const control = new FormControl('12345678909');
    const result = cpfValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for valid CPF with formatting', () => {
    const control = new FormControl('123.456.789-09');
    const result = cpfValidator(control);
    expect(result).toBeNull();
  });

  it('should return { cpf: true } for invalid CPF', () => {
    const control = new FormControl('12345678900');
    const result = cpfValidator(control);
    expect(result).toEqual({ cpf: true });
  });

  it('should return { cpf: true } for CPF with wrong formatting', () => {
    const control = new FormControl('123.456.789.09');
    const result = cpfValidator(control);
    expect(result).toEqual({ cpf: true });
  });

  it('should return { cpf: true } for CPF with incorrect length', () => {
    const control = new FormControl('123456789');
    const result = cpfValidator(control);
    expect(result).toEqual({ cpf: true });
  });

  it('should return { cpf: true } for CPF with all same digits', () => {
    const control = new FormControl('11111111111');
    const result = cpfValidator(control);
    expect(result).toEqual({ cpf: true });
  });

  it('should return { cpf: true } for CPF with all same digits formatted', () => {
    const control = new FormControl('111.111.111-11');
    const result = cpfValidator(control);
    expect(result).toEqual({ cpf: true });
  });

  it('should return null for empty value', () => {
    const control = new FormControl('');
    const result = cpfValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for null value', () => {
    const control = new FormControl(null);
    const result = cpfValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for undefined value', () => {
    const control = new FormControl(undefined);
    const result = cpfValidator(control);
    expect(result).toBeNull();
  });

  it('should validate various valid CPFs', () => {
    const validCpfs = [
      '52998224725',
      '529.982.247-25',
      '93541134780',
      '935.411.347-80',
    ];

    validCpfs.forEach((cpf) => {
      const control = new FormControl(cpf);
      const result = cpfValidator(control);
      expect(result).toBeNull();
    });
  });

  it('should validate various invalid CPFs', () => {
    const invalidCpfs = [
      '52998224726',
      '93541134781',
      '12345678901',
      '00000000000',
      '99999999999',
    ];

    invalidCpfs.forEach((cpf) => {
      const control = new FormControl(cpf);
      const result = cpfValidator(control);
      expect(result).toEqual({ cpf: true });
    });
  });
});
