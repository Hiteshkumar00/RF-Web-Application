import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AgencyApiService } from '../../services/agency-api.service';
import { AgencyFormService } from '../../services/agency-form.service';
import { AgencyDto } from '../../models/agency.model';
import { AgencyLabels } from '../../constants/agency-labels.constants';
import { CreateAgencyDto } from '../../models/agency-create.dto';
import { UpdateAgencyDto } from '../../models/agency-update.dto';

@Component({
    selector: 'app-agency-form-dialog',
    standalone: false,
    templateUrl: './agency-form-dialog.component.html'
})
export class AgencyFormDialogComponent implements OnChanges, OnDestroy {
    private agencyApiService = inject(AgencyApiService);
    private agencyFormService = inject(AgencyFormService);
    private confirmationService = inject(ConfirmationService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' = 'create';
    @Input() agency: AgencyDto | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    labels = AgencyLabels;
    form!: FormGroup;
    private isClosing = false;

    get dialogTitle(): string {
        return this.mode === 'create' ? this.labels.CREATE_DIALOG_TITLE : this.labels.UPDATE_DIALOG_TITLE;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            if (this.mode === 'create') {
                this.form = this.agencyFormService.createForm();
            } else {
                this.form = this.agencyFormService.createUpdateForm();
                if (this.agency) {
                    this.agencyFormService.patchForm(this.form, this.agency);
                }
            }
        }
    }

    ngOnDestroy(): void { }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.mode === 'create') {
            const dto: CreateAgencyDto = this.form.value;
            this.agencyApiService.create(dto).subscribe({
                next: () => this.saved.emit()
            });
        } else {
            const dto: UpdateAgencyDto = { id: this.agency!.id, ...this.form.value };
            this.agencyApiService.update(dto).subscribe({
                next: () => this.saved.emit()
            });
        }
    }

    requestClose(): void {
        if (this.isClosing) return;

        if (this.form?.dirty) {
            this.isClosing = true;
            this.confirmationService.confirm({
                header: this.labels.UNSAVED_CONFIRM_HEADER,
                message: this.labels.UNSAVED_CONFIRM_MESSAGE,
                icon: 'pi pi-exclamation-circle',
                acceptLabel: this.labels.YES,
                rejectLabel: this.labels.NO,
                acceptButtonStyleClass: 'p-button-warning',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    this.isClosing = false;
                    this.closed.emit();
                },
                reject: () => {
                    this.isClosing = false;
                }
            });
        } else {
            this.closed.emit();
        }
    }
}
