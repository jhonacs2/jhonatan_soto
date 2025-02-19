import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'bp-finance-view',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './finance-view.component.html',
  styleUrls: ['./finance-view.component.scss']
})
export class FinanceViewComponent {

}
