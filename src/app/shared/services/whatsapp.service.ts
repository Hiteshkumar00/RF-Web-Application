import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WhatsAppService {
    constructor() { }

    async sendBillOnWhatsApp(bill: any, blob?: Blob) {
        const phone = bill.phoneNo;
        const name = bill.customerName || bill.agencyName || 'Customer';
        const billNo = bill.billNo || bill.id;

        if (blob) {
            try {
                const file = new File([blob], `Bill_${billNo}.pdf`, { type: 'application/pdf' });

                // Try Web Share API (Works on Mobile/Modern Browsers)
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `Invoice ${billNo}`,
                        text: `Hello ${name}, please find attached your invoice ${billNo}.`
                    });
                    return; // Shared successfully
                }
            } catch (error) {
                console.error('Sharing failed', error);
            }
        }

        // Fallback to WhatsApp Link (Message ONLY, no attachment)
        this.openWhatsAppLink(bill);
    }

    private openWhatsAppLink(bill: any) {
        const phone = bill.phoneNo;
        if (!phone) return;

        const isPending = (bill.remainingAmount || 0) > 0;
        const netAmount = bill.netAmount || bill.finalAmount || 0;
        const paidAmount = bill.paidAmount || 0;
        const remainingAmount = bill.remainingAmount || 0;
        const billNo = bill.billNo;
        const date = bill.date;
        const name = bill.customerName || bill.agencyName || 'Customer';
        const id = bill.id;

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

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${this.formatPhone(phone)}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    private formatPhone(phone: string): string {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) cleaned = '91' + cleaned;
        return cleaned;
    }
}
