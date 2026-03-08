
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ThemeSwitcher } from './components/theme-switcher/theme-switcher';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StyleClassModule } from 'primeng/styleclass';
import { ToolbarModule } from 'primeng/toolbar';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [ThemeSwitcher, HeaderComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    CardModule,
    StyleClassModule,
    ToolbarModule,
    DrawerModule,
    PanelMenuModule
  ],
  exports: [
    RouterModule,
    ThemeSwitcher,
    SelectButtonModule,
    ButtonModule,
    CardModule,
    StyleClassModule,
    ToolbarModule,
    DrawerModule,
    PanelMenuModule,
    HeaderComponent,
    SidebarComponent
  ]
})
export class SharedModule { }