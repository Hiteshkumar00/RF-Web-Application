import { Injectable, inject } from '@angular/core';
import { SellingBillApiService } from '../../features/selling-bill/services/selling-bill-api.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    private billingApiService = inject(SellingBillApiService);
    private messageService = inject(MessageService);

    constructor() { }

    sendBillOnEmail(bill: any) {
        this.billingApiService.sendEmailMessage(bill.id).subscribe({
            next: () => this.messageService.add({ 
                severity: 'success', 
                summary: 'Email Service', 
                detail: 'Bill has been sent successfully to ' + bill.email 
            }),
            error: (err) => this.messageService.add({ 
                severity: 'error', 
                summary: 'Email Error', 
                detail: 'Failed to send email. Please check your SMTP settings.' 
            })
        });
    }
}
