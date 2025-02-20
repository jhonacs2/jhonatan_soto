import {NgModule} from '@angular/core';
import {FinanceRoutingModule} from './routes/finance-routing.module';
import {ProductService} from './services/product.service';

@NgModule({
  imports: [
    FinanceRoutingModule
  ],
  providers: [ProductService]
})
export default class FinanceModule {
}
