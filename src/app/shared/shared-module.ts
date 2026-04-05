
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

// New PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';

import { ConfirmationService, MessageService } from 'primeng/api';


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
    MessageModule,
    TableModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    FloatLabelModule,
    TooltipModule,
    DividerModule,
    PasswordModule,
    SelectModule,
    ImageModule,
    CheckboxModule,
    TextareaModule,
    TagModule,

    ReactiveFormsModule

  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
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
    ErrorDialogComponent,
    ProgressSpinnerModule,
    DialogModule,
    MessageModule,
    TableModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    FloatLabelModule,
    TooltipModule,
    DividerModule,
    PasswordModule,
    SelectModule,
    ImageModule,
    CheckboxModule,
    TextareaModule,
    TagModule,

    ReactiveFormsModule

  ],
  providers: []
})
export class SharedModule { }
