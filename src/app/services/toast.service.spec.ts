import {TestBed} from '@angular/core/testing';

import {ToastService} from './toast.service';
import {ToastComponent} from '../shared/toast/toast.component';
import {ApplicationRef, ComponentFactory, ComponentFactoryResolver, Injector} from '@angular/core';

describe('ToastService', () => {
    let service: ToastService;
    let componentFactoryResolver: jasmine.SpyObj<ComponentFactoryResolver>; // Tipo correcto para el spy
    let appRef: jasmine.SpyObj<ApplicationRef>;
    let injector: jasmine.SpyObj<Injector>;

    beforeEach(() => {
        const componentFactoryResolverSpy = jasmine.createSpyObj('ComponentFactoryResolver', ['resolveComponentFactory']);
        const appRefSpy = jasmine.createSpyObj('ApplicationRef', ['attachView', 'detachView']);
        const injectorSpy = jasmine.createSpyObj('Injector', ['get']);

        TestBed.configureTestingModule({
            imports: [ToastComponent],
            providers: [
                {provide: ComponentFactoryResolver, useValue: componentFactoryResolverSpy},
                {provide: ApplicationRef, useValue: appRefSpy},
                {provide: Injector, useValue: injectorSpy}
            ]
        });

        service = TestBed.inject(ToastService);
        componentFactoryResolver = TestBed.inject(ComponentFactoryResolver) as jasmine.SpyObj<ComponentFactoryResolver>;
        appRef = TestBed.inject(ApplicationRef) as jasmine.SpyObj<ApplicationRef>;
        injector = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;
    });

    it('should create and display a toast', () => {
        const componentRefSpy = jasmine.createSpyObj('ComponentRef', ['instance', 'hostView', 'destroy']);
        const componentFactorySpy = jasmine.createSpyObj<ComponentFactory<ToastComponent>>('ComponentFactory', ['create']); // Spy on ComponentFactory
        componentFactorySpy.create.and.returnValue(componentRefSpy);
        componentFactoryResolver.resolveComponentFactory.and.returnValue(componentFactorySpy);
    });
});
