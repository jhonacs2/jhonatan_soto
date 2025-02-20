import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { IProductResponse } from '../../api/response/product-response.interface';
import { ApiResponse } from '../../api/api-response.interface';
import {financialProducts} from '../../spec-helpers/product.spec-helper';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return a list of products', () => {
      const mockResponse: ApiResponse<IProductResponse[]> = {
        data: financialProducts,
      };

      service.getProducts().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/bp/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createProduct', () => {
    it('should create a product', () => {
      const productRequest = {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        logo: 'logo2.png',
        date_release: new Date(),
        date_revision: new Date(),
      };

      const mockResponse: IProductResponse = {
        ...productRequest
      };

      service.createProduct(productRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/bp/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(productRequest);
      req.flush(mockResponse);
    });
  });

  describe('verifyId', () => {
    it('should verify if the product ID exists', () => {
      const mockResponse: IProductResponse = financialProducts[1];

      service.verifyId(1).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/bp/products/verification/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getProduct', () => {
    it('should fetch a specific product', () => {
      const mockResponse: IProductResponse = financialProducts[1];

      service.getProduct(1).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/bp/products/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('editProduct', () => {
    it('should edit a product', () => {
      const productRequest = {
        id: '1',
        name: 'Updated Product',
        description: 'Updated Description',
        logo: 'updated-logo.png',
        date_release: new Date(),
        date_revision: new Date(),
      };

      const mockResponse: ApiResponse<IProductResponse> = {
        data: productRequest
      };

      service.editProduct(productRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`/api/bp/products/${productRequest.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(productRequest);
      req.flush(mockResponse);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', () => {
      const mockResponse: ApiResponse<IProductResponse> = {
        data: {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          logo: 'logo1.png',
          date_release: new Date(),
          date_revision: new Date(),
        },
      };

      service.deleteProduct(1).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/bp/products/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
