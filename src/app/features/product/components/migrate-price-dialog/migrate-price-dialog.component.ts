import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  selector: 'app-migrate-price-dialog',
  standalone: false,
  templateUrl: './migrate-price-dialog.component.html'
})
export class MigratePriceDialogComponent {
  private apiService = inject(ProductApiService);
  private messageService = inject(MessageService);

  @Input() visible = false;
  @Input() productIds: number[] = [];
  
  @Output() onSave = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  marginPercentage = 25;
  migrating = false;

  applyMigratePrice(): void {
    if (this.productIds.length === 0) return;

    this.migrating = true;
    this.apiService.migratePrice({ productIds: this.productIds, marginPercentage: this.marginPercentage }).subscribe({
      next: (res: any) => {
        this.migrating = false;
        if (res !== null) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Price migration completed.' });
          this.onSave.emit();
          this.close();
        }
      },
      error: () => {
        this.migrating = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to migrate prices.' });
      }
    });
  }

  close(): void {
    this.onClose.emit();
  }
}
