import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FinanceViewComponent} from '../view/finance-view/finance-view.component';

const routes: Routes = [
  {
    path: '',
    component: FinanceViewComponent,
    children: [
      {
        path: 'product',
        loadComponent: () => import('../components/product-table/product-table.component').then(m => m.ProductTableComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'product'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule {
}
