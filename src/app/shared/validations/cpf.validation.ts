import { AbstractControl } from '@angular/forms';

export function cpfValidator(control: AbstractControl): any {

  if (!control.value) {
    return null;
  }

  let cpf = control.value;
  if (cpf.length !== 11 && cpf.length !== 14) {
    return { cpf: true };
  }
  if (cpf.length === 14) {
    if (control.value[3] !== '.' || control.value[7] !== '.' || control.value[11] !== '-') {
      return { cpf: true };
    }
  }
  cpf = control.value.replace(/\D/g, '');

  if (/^([0-9])\1*$/.test(cpf)) {
    return { cpf: true };
  }
  let soma = 0;
  let resto = 0;

  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) {
    resto = 0;
  }
  if (resto !== parseInt(cpf.substring(9, 10))) {
    return { cpf: true };
  }

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) {
    resto = 0;
  }

  if (resto !== parseInt(cpf.substring(10, 11))) {
    return { cpf: true };
  }

  return null;
}
