import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AgencyPersonApiService } from '../../services/agency-person-api.service';
import { AgencyPersonFormService } from '../../services/agency-person-form.service';
import { AgencyApiService } from '../../services/agency-api.service';
import { AgencyPersonDto } from '../../models/agency-person.model';
import { AgencyPersonLabels } from '../../constants/agency-person-labels.constants';
import { CreateAgencyPersonDto } from '../../models/agency-person-create.dto';
import { UpdateAgencyPersonDto } from '../../models/agency-person-update.dto';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';

@Component({
    selector: 'app-agency-person-form-dialog',
    standalone: false,
    templateUrl: './agency-person-form-dialog.component.html'
})
export class AgencyPersonFormDialogComponent implements OnChanges, OnDestroy {
    private agencyPersonApiService = inject(AgencyPersonApiService);
    private agencyPersonFormService = inject(AgencyPersonFormService);
    private agencyApiService = inject(AgencyApiService);
    private confirmationService = inject(ConfirmationService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() person: AgencyPersonDto | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    labels = AgencyPersonLabels;
    form!: FormGroup;
    agencyOptions: DropdownOption[] = [];
    private isClosing = false;

    get dialogTitle(): string {
        switch (this.mode) {
            case 'create': return this.labels.CREATE_DIALOG_TITLE;
            case 'update': return this.labels.UPDATE_DIALOG_TITLE;
            case 'view': return this.labels.VIEW_DIALOG_TITLE;
            default: return '';
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.loadAgencyOptions();
            this.form = this.agencyPersonFormService.createForm();
            if ((this.mode === 'update' || this.mode === 'view') && this.person) {
                this.agencyPersonFormService.patchForm(this.form, this.person);

                if (this.mode === 'view') {
                    this.form.disable();
                }
            }
        }
    }

    ngOnDestroy(): void { }

    private loadAgencyOptions(): void {
        this.agencyApiService.getAll().subscribe({
            next: (agencies) => {
                this.agencyOptions = (agencies ?? []).map(a => ({
                    label: a.agencyName,
                    value: a.id
                }));
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.mode === 'create') {
            const dto: CreateAgencyPersonDto = this.form.value;
            this.agencyPersonApiService.create(dto).subscribe({
                next: () => this.saved.emit()
            });
        } else {
            const dto: UpdateAgencyPersonDto = { id: this.person!.id, ...this.form.value };
            this.agencyPersonApiService.update(dto).subscribe({
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
