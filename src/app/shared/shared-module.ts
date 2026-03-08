
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
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [ThemeSwitcher, HeaderComponent, SidebarComponent, LoaderComponent, ErrorDialogComponent],
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
    PanelMenuModule,
    ProgressSpinnerModule,
    DialogModule,
    MessageModule
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
    SidebarComponent,
    LoaderComponent,
    ErrorDialogComponent
  ]
})
export class SharedModule { }
