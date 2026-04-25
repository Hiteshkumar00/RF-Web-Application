import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SystemConfigurationRoutingModule } from './system-configuration-routing.module';
import { SystemConfigurationListComponent } from './components/system-configuration-list/system-configuration-list.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    SystemConfigurationListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SystemConfigurationRoutingModule,
    SharedModule
  ]
})
export class SystemConfigurationModule { }
