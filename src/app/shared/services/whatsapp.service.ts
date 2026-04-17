import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccountDetailsService } from '../../core/services/account-details.service';
import { SellingBillApiService } from '../../features/selling-bill/services/selling-bill-api.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class WhatsAppService {
    private accountDetailsService = inject(AccountDetailsService);
    private billingApiService = inject(SellingBillApiService);
    private messageService = inject(MessageService);

    constructor() { }

    async sendBillOnWhatsApp(bill: any, blob?: Blob, fileName?: string) {
        // If Advanced API is enabled, trigger backend sending
        if (this.accountDetailsService.enableAdvancedWhatsApp) {
            this.billingApiService.sendWhatsAppMessage(bill.id).subscribe({
                next: () => this.messageService.add({ severity: 'success', summary: 'WhatsApp API', detail: 'Message sent via WhatsApp Business API' }),
                error: (err) => this.messageService.add({ severity: 'error', summary: 'API Error', detail: 'Failed to send via Business API. Try normal sharing.' })
            });
            return;
        }

        const phone = bill.phoneNo;
        const name = bill.customerName || bill.agencyName || 'Customer';
        const billNo = bill.billNo || bill.id;
        const finalFileName = fileName || `Bill_${billNo}.pdf`;
        const id = bill.id;

        // 1. Generate the Professional Message
        const isPending = (bill.remainingAmount || 0) > 0;
        const netAmount = bill.netAmount || bill.finalAmount || 0;
        const paidAmount = bill.paidAmount || 0;
        const remainingAmount = bill.remainingAmount || 0;
        const date = bill.date;
        const pdfLink = `${environment.apiUrl}/SellingBill/PrintInvoice/${id}`;

        let message = '';
        if (isPending) {
            message = `*Pending Payment Reminder*\n\nHello *${name}*,\n\nYour bill *${billNo}* dated *${date}* has a pending balance.\n\n` +
                `Total Amount: ₹${netAmount.toLocaleString('en-IN')}\n` +
                `Paid Amount: ₹${paidAmount.toLocaleString('en-IN')}\n` +
                `*Remaining Balance: ₹${remainingAmount.toLocaleString('en-IN')}*\n\n` +
                `📄 *View Invoice:* ${pdfLink}\n\n` +
                `Please settle the amount at your earliest convenience. Thank you!`;
        } else {
            message = `*Payment Successful*\n\nHello *${name}*,\n\nYour bill *${billNo}* dated *${date}* has been successfully paid.\n\n` +
                `Total Amount: ₹${netAmount.toLocaleString('en-IN')}\n` +
                `Payment Status: *Full Paid*\n\n` +
                `📄 *View Invoice:* ${pdfLink}\n\n` +
                `Thank you for choosing us!`;
        }

        // 2. Try Native Sharing (File + Message Together)
        if (blob) {
            try {
                const file = new File([blob], finalFileName, { type: 'application/pdf' });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `Invoice ${billNo}`,
                        text: message
                    });
                    return;
                }
            } catch (error) {
                console.error('Sharing failed', error);
            }
        }

        // 3. Fallback to WhatsApp Link (Message ONLY)
        if (phone) {
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${this.formatPhone(phone)}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    private formatPhone(phone: string): string {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) cleaned = '91' + cleaned;
        return cleaned;
    }
}
