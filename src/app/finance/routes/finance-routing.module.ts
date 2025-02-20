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
        path: 'edit-product/:id',
        loadComponent: () => import('../components/edit-product/edit-product.component').then(m => m.EditProductComponent)
      },
      {
        path: 'edit-product',
        loadComponent: () => import('../components/edit-product/edit-product.component').then(m => m.EditProductComponent)
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
