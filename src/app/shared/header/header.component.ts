import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'bp-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
}
