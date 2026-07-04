import { Injectable, ApplicationRef, EnvironmentInjector, createComponent, ComponentRef, Type } from '@angular/core';
import { firstValueFrom, isObservable, Observable } from 'rxjs';

export interface DialogConfig<T> {
  inputs?: Partial<T>;
  outputs?: Partial<Record<keyof T, (val: any) => void>>;
  resolve?: { [K in keyof Partial<T>]?: Observable<any> | Promise<any> | any };
}

@Injectable({
  providedIn: 'root'
})
export class DialogManagerService {
  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  async openAsync<T>(
    componentType: Type<T>,
    config: DialogConfig<T>
  ): Promise<ComponentRef<T>> {
    const resolvedInputs: Partial<T> = { ...(config.inputs || {}) } as Partial<T>;

    if (config.resolve) {
      const keys = Object.keys(config.resolve) as (keyof T)[];
      const promises = keys.map(async (key) => {
        const value: any = config.resolve![key];
        if (isObservable(value)) {
          resolvedInputs[key] = (await firstValueFrom(value)) as any;
        } else if (value instanceof Promise) {
          resolvedInputs[key] = (await value) as any;
        } else {
          resolvedInputs[key] = value as any;
        }
      });
      await Promise.all(promises);
    }

    return this.open(componentType, resolvedInputs, config.outputs);
  }

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
