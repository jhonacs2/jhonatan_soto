import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ProductService} from '../../services/product.service';
import {ToastService} from '../../../services/toast.service';
import {ActivatedRoute} from '@angular/router';
import {of, throwError} from 'rxjs';
import {ICreateProductRequest} from '../../../api/request/create-product-request.interface';
import {ToastType} from '../../../enum/toast-type.enum';
import {ReactiveFormsModule} from '@angular/forms';
import {EditProductComponent} from '../edit-product/edit-product.component';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let activatedRouteStub: any;

  const mockProduct: ICreateProductRequest = {
    id: '123',
    name: 'Product Name',
    description: 'Product Description',
    logo: 'logo.png',
    date_release: new Date('2024-05-01'),
    date_revision: new Date('2025-05-01'),
  };

  beforeEach(async () => {
    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => '123',
        },
      },
    };

    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'editProduct',
      'createProduct',
      'getProduct'
    ]);

    toastServiceSpy = jasmine.createSpyObj('ToastService', ['createToast']);

    await TestBed.configureTestingModule({
      imports: [EditProductComponent, ReactiveFormsModule],
      providers: [
        {provide: ProductService, useValue: productServiceSpy},
        {provide: ToastService, useValue: toastServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
  });
});
