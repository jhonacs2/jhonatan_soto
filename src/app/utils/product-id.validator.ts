import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {catchError, map, Observable, of} from 'rxjs';
import {ProductService} from '../finance/services/product.service';
import {IProductResponse} from '../api/response/product-response.interface';

export class ProductIdValidator {
  static createIdValidator(productsService: ProductService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      control.markAsPending();
      return productsService.verifyId(control.value).pipe(
        map((product: IProductResponse | undefined) => !!product),
        map((result: boolean) => (result ? {idAlreadyExists: true} : null)),
        catchError(() => of(null))
      );
    };
  }
}
