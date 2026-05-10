import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  standalone: false,
  template: `
    <p-dialog [(visible)]="visible" [modal]="true" [dismissableMask]="true" (onHide)="onHide()"
        [header]="header" [style]="{ width: 'fit-content', maxWidth: '90vw' }" [draggable]="false" [resizable]="false"
        class="image-preview-dialog premium-dialog">
        <div class="image-wrapper d-flex justify-content-center align-items-center bg-light bg-opacity-50 rounded-3 overflow-hidden" 
             style="min-height: 200px; min-width: 200px;">
            <p-image *ngIf="imageUrl" [src]="imageUrl" [alt]="header" [preview]="true"
                [imageStyle]="{ 'width': 'auto', 'height': 'auto', 'max-width': '100%', 'max-height': '75vh', 'object-fit': 'contain', 'display': 'block', 'border-radius': '8px' }"
                styleClass="shadow-sm" />
            <div *ngIf="!imageUrl" class="p-5 text-muted text-center italic">
                <i class="pi pi-image fs-1 mb-2 opacity-50"></i>
                <p>No image available</p>
            </div>
        </div>
    </p-dialog>
  `
})
export class ImagePreviewComponent {
  @Input() visible = false;
  @Input() imageUrl = '';
  @Input() header = 'Image Preview';

  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
