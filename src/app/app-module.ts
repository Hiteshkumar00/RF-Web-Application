import { NgModule, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { SharedModule } from './shared/shared-module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { GlobalConfigService } from './core/services/global-config.service';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.p-dark', ripple: true } },
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: GlobalConfigService) => () => configService.init(),
      deps: [GlobalConfigService],
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
