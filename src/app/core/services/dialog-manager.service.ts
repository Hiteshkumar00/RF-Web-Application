import { Injectable, ApplicationRef, EnvironmentInjector, createComponent, ComponentRef, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogManagerService {
  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open<T>(
    componentType: Type<T>,
    inputs: Partial<T> = {},
    outputs: Partial<Record<keyof T, (val: any) => void>> = {}
  ): ComponentRef<T> {
    const componentRef = createComponent(componentType, {
      environmentInjector: this.injector
    });

    // Set Inputs
    for (const [key, value] of Object.entries(inputs)) {
      componentRef.setInput(key, value);
    }

    // Bind Outputs
    for (const [key, callback] of Object.entries(outputs)) {
      const emitter = (componentRef.instance as any)[key];
      if (emitter && typeof emitter.subscribe === 'function') {
        emitter.subscribe((eventData: any) => {
          if (callback) {
            (callback as any)(eventData);
          }
        });
      }
    }

    // Attach to App View for change detection
    this.appRef.attachView(componentRef.hostView);

    // Append to body
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    return componentRef;
  }

  destroy<T>(componentRef: ComponentRef<T>): void {
    if (componentRef) {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }
  }
}
