import { Component, OnInit } from '@angular/core';
import { SystemConfigurationService } from '../../services/system-configuration.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { SystemConfiguration } from '../../models/system-configuration';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-system-configuration-list',
  standalone: false,
  templateUrl: './system-configuration-list.component.html'
})
export class SystemConfigurationListComponent implements OnInit {
  configurations: SystemConfiguration[] = [];
  loading: boolean = false;
  saving: boolean = false;

  constructor(
    private configService: SystemConfigurationService,
    private messageService: MessageService,
    public globalConfig: GlobalConfigService
  ) { }

  ngOnInit(): void {
    this.loadConfigurations();
  }

  loadConfigurations(): void {
    this.loading = true;
    this.configService.getAll().subscribe({
      next: (data) => {
        this.configurations = (data ?? []).map(c => ({
          ...c,
          propertyValueBool: c.propertyType === 'boolean' ? c.propertyValue === 'true' : false
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  saveAll(): void {
    this.saving = true;
    const dtos = this.configurations.map(config => ({
      id: config.id,
      propertyValue: config.propertyType === 'boolean'
        ? config.propertyValueBool?.toString() || 'false'
        : config.propertyValue
    }));

    this.configService.updateMultiple(dtos).subscribe({
      next: (success) => {
        this.saving = false;
        if (success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All configurations saved successfully' });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      },
      error: () => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save configurations' });
      }
    });
  }
}
