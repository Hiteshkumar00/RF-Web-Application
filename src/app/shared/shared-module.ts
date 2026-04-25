
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
import { MenuModule } from 'primeng/menu';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { RfDatePipe } from './pipes/rf-date.pipe';
import { RfShortDatePipe } from './pipes/rf-short-date.pipe';

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
import { DatePickerModule } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AutoCompleteModule } from 'primeng/autocomplete';

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
    DatePickerModule,
    ChartModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    ToggleSwitchModule,
    AutoCompleteModule,
    MenuModule,
    RfDatePipe,
    RfShortDatePipe
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
    RfDatePipe,
    RfShortDatePipe,
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
    DatePickerModule,
    ChartModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    ToggleSwitchModule,
    AutoCompleteModule,
    MenuModule
  ],
  providers: []
})
export class SharedModule { }
