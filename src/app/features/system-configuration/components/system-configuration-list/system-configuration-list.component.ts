import { Component, OnInit } from '@angular/core';
import { SystemConfigurationService } from '../../services/system-configuration.service';
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

  constructor(
    private configService: SystemConfigurationService,
    private messageService: MessageService
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

  onUpdate(config: SystemConfiguration): void {
    const propertyValue = config.propertyType === 'boolean' 
      ? config.propertyValueBool?.toString() || 'false'
      : config.propertyValue;

    this.configService.update({ id: config.id, propertyValue }).subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Configuration updated' });
        }
      }
    });
  }
}
