import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'bp-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableComponent {

}
