import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injectable,
  Injector
} from '@angular/core';
import {ToastType} from '../enum/toast-type.enum';
import {timer} from 'rxjs';
import {ToastComponent} from '../shared/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  #appRef: ApplicationRef = inject(ApplicationRef);
  #componentFactoryResolver: ComponentFactoryResolver = inject(ComponentFactoryResolver);
  #injector: Injector = inject(Injector);

  readonly #TIME_DEFAULT_TOAST: number = 4000;

  createToast(title: ToastType, bodyText: string = ''): void {
    const componentRef: ComponentRef<ToastComponent> = this.#componentFactoryResolver
      .resolveComponentFactory(ToastComponent).create(this.#injector);
    componentRef.instance.type = title;
    componentRef.instance.bodyText = bodyText;
    this.#appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    timer(this.#TIME_DEFAULT_TOAST).subscribe(() => this.#destroyToastComponent(componentRef));
  }

  #destroyToastComponent(componentRef: ComponentRef<ToastComponent>): void {
    this.#appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
