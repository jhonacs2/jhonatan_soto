import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IProductResponse} from '../../api/response/product-response.interface';
import {first, Observable} from 'rxjs';
import {ICreateProductRequest} from '../../api/request/create-product-request.interface';
import {ApiResponse} from '../../api/api-response.interface';

@Injectable()
export class ProductService {
  #httpClient: HttpClient = inject(HttpClient);

  getProducts(): Observable<ApiResponse<IProductResponse[]>> {
    return this.#httpClient.get<ApiResponse<IProductResponse[]>>('/api/bp/products').pipe(first());
  }

  createProduct(product: ICreateProductRequest): Observable<IProductResponse> {
    return this.#httpClient.post<IProductResponse>('/api/bp/products', product).pipe(first());
  }

  verifyId(id: number | string): Observable<IProductResponse | undefined> {
    return this.#httpClient.get<IProductResponse | undefined>(`/api/bp/products/verification/${id}`).pipe(first());
  }

  getProduct(id: number | string): Observable<IProductResponse> {
    return this.#httpClient.get<IProductResponse>(`/api/bp/products/${id}`).pipe(first());
  }

  editProduct(product: ICreateProductRequest): Observable<ApiResponse<IProductResponse>> {
    return this.#httpClient.put<ApiResponse<IProductResponse>>(`/api/bp/products/${product.id}`, product).pipe(first());
  }

  deleteProduct(id: number | string): Observable<ApiResponse<IProductResponse>> {
    return this.#httpClient.delete<ApiResponse<IProductResponse>>(`/api/bp/products/${id}`).pipe(first());
  }
}
