import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {debounceTime, first, Subject, takeUntil} from 'rxjs';
import {IProductResponse} from '../../../api/response/product-response.interface';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ModalProductComponent} from '../modal-product/modal-product.component';
import {ToastType} from '../../../enum/toast-type.enum';
import {ToastService} from '../../../services/toast.service';
import {ProductSkeletonComponent} from '../product-skeleton/product-skeleton.component';

@Component({
  selector: 'bp-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    RouterLink,
    NgClass,
    FormsModule,
    ProductSkeletonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTableComponent implements OnInit {
  @ViewChild('viewContainerRef', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;

  #productService: ProductService = inject(ProductService);
  #cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  #toastService: ToastService = inject(ToastService);

  filterProduct: IProductResponse[] = [];
  isLoading: boolean = true;
  limitProducts: number = 5;
  productList: IProductResponse[] = [];
  productSearch: string = '';
  showMenuIndex: number = -1;
  totalProducts: number = 0;

  #debounceSearch: Subject<string> = new Subject<string>();

  readonly #DELETE_MESSAGE_PRODUCT: string = 'Estas seguro de eliminar el producto';
  readonly #IMG_ERROR: string = 'assets/images/error-img.png';
  readonly #unsubscribe: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.#initialize();
  }

  onSearch(): void {
    this.#debounceSearch.next(this.productSearch);
  }

  toggleMenu(index: number): void {
    this.showMenuIndex = (this.showMenuIndex === index) ? -1 : index;
  }

  errorLoadImage(image: HTMLImageElement): void {
    image.src = this.#IMG_ERROR;
  }

  changeLimitPerPage(selectTotal: HTMLSelectElement): void {
    this.limitProducts = parseInt(selectTotal.options[selectTotal.selectedIndex].value);
    this.filterProduct = this.productList.slice(0, this.limitProducts);
    this.totalProducts = this.filterProduct.length;
  }

  trackByProductId(index: number, product: IProductResponse): string {
    return product.id;
  }

  deleteFinancialProduct(financialProduct: IProductResponse): void {
    this.#createModalToDeleteProduct(financialProduct);
  }

  #createModalToDeleteProduct(financialProduct: IProductResponse): void {
    const modalComponentRef: ComponentRef<ModalProductComponent> = this.viewContainerRef.createComponent(ModalProductComponent);
    modalComponentRef.instance.message = `${this.#DELETE_MESSAGE_PRODUCT} ${financialProduct.name}?`;
    this.#listenCancelModal(modalComponentRef);
    this.#listenSuccessModal(modalComponentRef, financialProduct);
  }

  #listenCancelModal(modalComponentRef: ComponentRef<ModalProductComponent>): void {
    modalComponentRef.instance.cancel.pipe(
      first(),
      takeUntil(this.#unsubscribe))
      .subscribe(() => modalComponentRef.destroy());
  }

  #listenSuccessModal(modalComponentRef: ComponentRef<any>, financialProduct: IProductResponse): void {
    modalComponentRef.instance.confirm
      .pipe(
        first(),
        takeUntil(this.#unsubscribe))
      .subscribe(() => {
        this.#productService.deleteProduct(financialProduct.id).subscribe({
          next: () => {
            this.#toastService.createToast(ToastType.SUCCESS, 'La eliminacion se realizo correctamente');
            this.toggleMenu(-1);
            this.#getProducts();
          },
          error: (err) => {
            this.#toastService.createToast(ToastType.ERROR, err.error);
            console.error(err);
          },
          complete: () => modalComponentRef.destroy()
        });
      });
  }

  #getProducts(): void {
    this.#productService.getProducts()
      .pipe(
        takeUntil(this.#unsubscribe),
      )
      .subscribe({
        next: (financialProducts) => {
          this.productList = financialProducts.data;
          this.filterProduct = financialProducts.data.slice(0, this.limitProducts);
          this.totalProducts = this.filterProduct.length;
          this.isLoading = false;
          this.#cdr.markForCheck();
        },
        error: (err) => {
          this.#toastService.createToast(ToastType.ERROR, err.error);
          console.error(err.error);
        }
      });
  }

  #listenDebounceSearch(): void {
    this.#debounceSearch.pipe(
      takeUntil(this.#unsubscribe),
      debounceTime(500))
      .subscribe(inputText => {
        this.filterProduct = this.productList.filter((product) =>
          product.name.toLowerCase().includes(inputText.toLowerCase()));
        this.totalProducts = this.filterProduct.length;
        this.#cdr.markForCheck();
      });
  }

  #initialize(): void {
    this.#getProducts();
    this.#listenDebounceSearch();
  }
}
