import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IProductResponse} from '../../api/response/product-response.interface';
import {Observable} from 'rxjs';

@Injectable()
export class ProductService {
  #httpClient: HttpClient = inject(HttpClient);

  public getProducts(): Observable<IProductResponse[]> {
    return this.#httpClient.get<IProductResponse[]>('/api/bp/products');
  }
}
