import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {forwardRef, InjectionToken, Type} from '@angular/core';

export interface ICustomValidatorHost {
  validate(c: AbstractControl): ValidationErrors | null;
}

export class CustomValidator<T extends ICustomValidatorHost> implements Validator {
  public onValidatorChange = () => {
  }

  constructor(private _host: T) {
  }

  public validate(c: AbstractControl): ValidationErrors | null {
    return this._host.validate(c);
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}

export interface IValidationProvider {
  provide: typeof NG_VALIDATORS;
  useExisting: Type<any>;
  multi: boolean;
}

export function customValidatorFactory(type: Function): IValidationProvider {
  return {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => type),
    multi: true
  };
}
