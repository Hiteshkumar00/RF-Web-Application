import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { EntityApiService } from '../../services/entity-api.service';
import { EntityFormService } from '../../services/entity-form.service';
import { EntityDto } from '../../models/entity.model';
import { EntityLabels } from '../../constants/entity-labels.constants';
import { CreateEntityDto } from '../../models/entity-create.dto';
import { UpdateEntityDto } from '../../models/entity-update.dto';

@Component({
    selector: 'app-entity-form-dialog',
    standalone: false,
    templateUrl: './entity-form-dialog.component.html'
})
export class EntityFormDialogComponent implements OnChanges {
    private entityApiService = inject(EntityApiService);
    private entityFormService = inject(EntityFormService);
    private confirmationService = inject(ConfirmationService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' = 'create';
    @Input() entity: EntityDto | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    labels = EntityLabels;
    form!: FormGroup;
    private isClosing = false;

    get dialogTitle(): string {
        return this.mode === 'create' ? this.labels.CREATE_DIALOG_TITLE : this.labels.UPDATE_DIALOG_TITLE;
    }

    get relatedEntities(): FormArray {
        return this.form.get('relatedEntities') as FormArray;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.form = this.entityFormService.createEntityForm();
            if (this.mode === 'update' && this.entity) {
                this.entityFormService.patchForm(this.form, this.entity);
            }
        }
    }

    addRelatedEntity(): void {
        this.entityFormService.addRelatedEntity(this.form);
    }

    removeRelatedEntity(index: number): void {
        this.entityFormService.removeRelatedEntity(this.form, index);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.value;

        if (this.mode === 'create') {
            const dto: CreateEntityDto = formValue;
            this.entityApiService.create(dto).subscribe({
                next: () => this.saved.emit()
            });
        } else {
            const dto: UpdateEntityDto = { id: this.entity!.id, ...formValue };
            this.entityApiService.update(dto).subscribe({
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
