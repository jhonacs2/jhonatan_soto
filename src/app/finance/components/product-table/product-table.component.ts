import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'bp-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableComponent implements OnInit {
  #productService: ProductService = inject(ProductService);
}
