import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'bp-modal-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalProductComponent {
  @Input() message: string = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    this.confirm.emit();
  }
}
