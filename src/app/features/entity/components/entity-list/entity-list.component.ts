import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EntityApiService } from '../../services/entity-api.service';
import { EntityDto } from '../../models/entity.model';
import { EntityLabels } from '../../constants/entity-labels.constants';
import { EntityMessages } from '../../constants/entity-messages.constants';
import { EntityTableColumns } from '../../constants/entity-table.constants';
import { GlobalConfigService } from '../../../../core/services/global-config.service';

@Component({
    selector: 'app-entity-list',
    standalone: false,
    templateUrl: './entity-list.component.html'
})
export class EntityListComponent implements OnInit {
    constructor(
        private entityApiService: EntityApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public globalConfig: GlobalConfigService
    ) {}

    labels = EntityLabels;
    columns = EntityTableColumns.COLUMNS;
    entities: EntityDto[] = [];

    // Dialog control
    showFormDialog = false;
    showViewDialog = false;
    formDialogMode: 'create' | 'update' = 'create';
    selectedEntity: EntityDto | null = null;

    ngOnInit(): void {
        this.loadEntities();
    }

    loadEntities(): void {
        this.entityApiService.getAll().subscribe({
            next: (data) => {
                this.entities = (data ?? []).map(entity => ({
                    ...entity,
                    relatedEntitiesCount: entity.relatedEntities?.length ?? 0
                })) as any; // relatedEntitiesCount is a virtual field for the table
            }
        });
    }

    openCreateDialog(): void {
        this.selectedEntity = null;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(entity: EntityDto): void {
        this.selectedEntity = entity;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(entity: EntityDto): void {
        this.selectedEntity = entity;
        this.showViewDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadEntities();
        const msg = this.formDialogMode === 'create'
            ? EntityMessages.CREATED
            : EntityMessages.UPDATED;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
    }

    confirmDelete(entity: EntityDto): void {
        this.confirmationService.confirm({
            header: this.labels.DELETE_CONFIRM_HEADER,
            message: this.labels.DELETE_CONFIRM_MESSAGE,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: this.labels.YES,
            rejectLabel: this.labels.NO,
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.deleteEntity(entity.id)
        });
    }

    private deleteEntity(id: number): void {
        this.entityApiService.delete(id).subscribe({
            next: () => {
                this.loadEntities();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: EntityMessages.DELETED });
            }
        });
    }
}
