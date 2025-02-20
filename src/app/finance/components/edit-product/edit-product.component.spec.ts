import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EditProductComponent} from './edit-product.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {ToastService} from '../../../services/toast.service';
import {of} from 'rxjs';
import {ICreateProductRequest} from '../../../api/request/create-product-request.interface';
import {ActivatedRoute} from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';
import {financialProducts} from '../../../spec-helpers/product.spec-helper';
import {ToastType} from '../../../enum/toast-type.enum';

describe('EditProductComponent', () => {
  let activatedRoute: any;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let toastService: jasmine.SpyObj<ToastService>;


  beforeEach(() => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['createProduct', 'editProduct', 'getProduct', 'verifyId']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['createToast']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);

    activatedRoute = {
      snapshot: {
        paramMap: {
          get: (param: string) => '' // Simula un ID en la ruta
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditProductComponent], // Importa el componente y ReactiveFormsModule
      providers: [
        {provide: ProductService, useValue: productServiceSpy},
        {provide: ToastService, useValue: toastServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: ChangeDetectorRef, useValue: cdr}
      ]
    });

    component = TestBed.createComponent(EditProductComponent).componentInstance;
    fixture = TestBed.createComponent(EditProductComponent);
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a product', () => {
    const mockProduct: ICreateProductRequest = {
      id: 'test-id',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: new Date('2024-01-01'),
      date_revision: new Date('2025-01-01')
    };
    productService.createProduct.and.returnValue(of(financialProducts[0]));
    productService.verifyId.and.returnValue(of(financialProducts[0]));

    component.signInFormGroup.setValue(mapProductToSignIn(mockProduct));
    component.onSend();

    expect(productService.createProduct).toHaveBeenCalledWith(mockProduct);
    expect(toastService.createToast).toHaveBeenCalledWith(ToastType.SUCCESS, 'Producto creado exitosamente');
    expect(component.signInFormGroup.get('id')?.value).toBeNull();
  });

  it('should reset the form', () => {
    component.signInFormGroup.setValue(mapProductToSignIn(financialProducts[0]));
    component.onResetForm();
    expect(component.signInFormGroup.get('id')?.value).toBeNull();
  });

  it('should not reset if is editable', () => {
    component.isEditable = true;
    component.signInFormGroup.setValue(mapProductToSignIn(financialProducts[0]));
    component.onResetForm();
    expect(component.signInFormGroup.get('id')?.value).toBe(financialProducts[0].id);
  });


  it('should handle create product error', () => {
    productService.editProduct.and.returnValue(of({
      message: '',
      data: financialProducts[0]
    }));

    component.isEditable = true;

    component.signInFormGroup.setValue(mapProductToSignIn(financialProducts[0]));
    component.onSend();

    expect(productService.editProduct).toHaveBeenCalled();
  });
});

export function mapProductToSignIn(value: ICreateProductRequest): any {
  return {
    id: value.id,
    name: value.name,
    description: value.description,
    logo: value.logo,
    releaseDate: value.date_release,
    reviewDate: value.date_revision,
  };
}
