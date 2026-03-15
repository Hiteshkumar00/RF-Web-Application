import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntityDto } from '../../models/entity.model';
import { EntityLabels } from '../../constants/entity-labels.constants';

@Component({
    selector: 'app-entity-view-dialog',
    standalone: false,
    templateUrl: './entity-view-dialog.component.html'
})
export class EntityViewDialogComponent {
    @Input() visible = false;
    @Input() entity: EntityDto | null = null;
    @Output() closed = new EventEmitter<void>();

    labels = EntityLabels;
}
