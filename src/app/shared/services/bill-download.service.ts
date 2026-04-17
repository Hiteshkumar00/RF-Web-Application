import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BillDownloadService {

    /**
     * Handles the logic for downloading a file from a Blob in the browser.
     * @param blob The blob content.
     * @param fileName The name of the file to be saved.
     */
    downloadFile(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}
