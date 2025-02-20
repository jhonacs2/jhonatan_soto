import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'bp-product-skeleton',
  standalone: true,
  templateUrl: './product-skeleton.component.html',
  styleUrls: ['./product-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSkeletonComponent {
}
