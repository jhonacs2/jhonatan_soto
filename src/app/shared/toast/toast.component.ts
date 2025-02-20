import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastType} from '../../enum/toast-type.enum';

@Component({
  selector: 'bp-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  @Input() type: ToastType = ToastType.SUCCESS;
  @Input() bodyText: string = '';
}
