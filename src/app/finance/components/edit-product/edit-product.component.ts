import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {filter, Subject, takeUntil} from 'rxjs';
import {ProductIdValidator} from '../../../utils/product-id.validator';
import {ProductService} from '../../services/product.service';
import {ICreateProductRequest} from '../../../api/request/create-product-request.interface';
import {formatDate, NgClass, NgIf} from '@angular/common';
import {ToastService} from '../../../services/toast.service';
import {ToastType} from '../../../enum/toast-type.enum';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'bp-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProductComponent implements OnInit, OnDestroy {
  #activeRoute: ActivatedRoute = inject(ActivatedRoute);
  #cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  #formBuilder: FormBuilder = inject(FormBuilder);
  #productService: ProductService = inject(ProductService);
  #toastService: ToastService = inject(ToastService);

  productId: string = this.#activeRoute.snapshot.paramMap.get('id') || '';
  isEditable: boolean = false;
  signInFormGroup = this.#formBuilder.group({
    id: new FormControl({value: '', disabled: false},
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      [ProductIdValidator.createIdValidator(this.#productService)]),
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', [Validators.required]],
    releaseDate: ['', [Validators.required, this.#validateReleaseDate]],
    reviewDate: new FormControl({value: '', disabled: true}, Validators.required)
  });

  private _unsubscribe: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this._initialize();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  onSend(): void {
    const product: ICreateProductRequest = this.#mapSignInFormToProduct(this.signInFormGroup.getRawValue());
    this.isEditable ? this.#editProduct(product) : this.#createProduct(product);
  }

  onResetForm(): void {
    if (this.isEditable) return;
    this.signInFormGroup.reset();
  }

  #editProduct(product: ICreateProductRequest): void {
    this.#productService.editProduct(product)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: () => {
          this.#toastService.createToast(ToastType.SUCCESS, `Producto ${product.name} editado exitosamente`);
        },
        error: () => this.#toastService.createToast(ToastType.ERROR, 'Error al editar el producto')
      });
  }

  #createProduct(product: ICreateProductRequest): void {
    this.#productService.createProduct(product)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: () => {
          this.#toastService.createToast(ToastType.SUCCESS, 'Producto creado exitosamente');
          this.signInFormGroup.reset();
        },
        error: () => this.#toastService.createToast(ToastType.ERROR, 'Error al crear el producto')
      });
  }

  #mapSignInFormToProduct(value: any): ICreateProductRequest {
    return {
      id: value.id,
      name: value.name,
      description: value.description,
      logo: value.logo,
      date_release: value.releaseDate,
      date_revision: value.reviewDate
    };
  }

  #mapProductToSignIn(value: ICreateProductRequest): any {
    return {
      id: value.id,
      name: value.name,
      description: value.description,
      logo: value.logo,
      releaseDate: value.date_release,
      reviewDate: value.date_revision,
    };
  }

  #validateReleaseDate(control: AbstractControl): {} | null {
    const releaseDate = new Date(control.value);
    const actualDate = new Date();
    return releaseDate.getFullYear() < actualDate.getFullYear() ? {invalidDate: true} : null;
  }

  #listenReleaseDate(): void {
    this.signInFormGroup.get('releaseDate')?.valueChanges
      .pipe(
        takeUntil(this._unsubscribe),
        filter(value => !!value))
      .subscribe((value) => {
        const [year, month, day] = value!.split('-');
        if (parseInt(year) <= 2000) return;
        const reviewDate = formatDate(`${parseInt(year) + 1}-${month}-${day}`, 'yyyy-MM-dd', 'en');
        this.signInFormGroup.get('reviewDate')?.setValue(reviewDate);
      });
  }

  #checkAndGetProduct(): void {
    if (this.productId) {
      this.#productService.getProduct(this.productId)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe({
          next: product => {
            this.isEditable = true;
            this.signInFormGroup.setValue(this.#mapProductToSignIn(product));
            const reviewDate = formatDate(product.date_release, 'yyyy-MM-dd', 'en');
            this.signInFormGroup.get('releaseDate')?.setValue(reviewDate);
            this.signInFormGroup.get('id')?.disable();
            this.#cdr.markForCheck();
          },
          error: () => this.#toastService.createToast(ToastType.ERROR, `Error al obtener el producto`)
        });
    }
  }

  private _initialize(): void {
    this.#listenReleaseDate();
    this.#checkAndGetProduct();
  }
}
