import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EntityDto, RelatedEntityDto } from '../models/entity.model';

@Injectable({
    providedIn: 'root'
})
export class EntityFormService {
    private fb = inject(FormBuilder);

    createEntityForm(): FormGroup {
        return this.fb.group({
            entityName: ['', [Validators.required, Validators.maxLength(250)]],
            displayName: ['', [Validators.maxLength(250)]],
            relatedEntities: this.fb.array([])
        });
    }

    createRelatedEntityForm(relatedEntity?: RelatedEntityDto): FormGroup {
        return this.fb.group({
            id: [relatedEntity?.id ?? null],
            relatedEntityName: [relatedEntity?.relatedEntityName ?? '', [Validators.required, Validators.maxLength(250)]],
            relatedDisplayName: [relatedEntity?.relatedDisplayName ?? '', [Validators.maxLength(250)]]
        });
    }

    patchForm(form: FormGroup, entity: EntityDto): void {
        form.patchValue({
            entityName: entity.entityName,
            displayName: entity.displayName ?? ''
        });

        const relatedEntitiesArray = form.get('relatedEntities') as FormArray;
        relatedEntitiesArray.clear();

        if (entity.relatedEntities && entity.relatedEntities.length > 0) {
            entity.relatedEntities.forEach(re => {
                relatedEntitiesArray.push(this.createRelatedEntityForm(re));
            });
        }
    }

    addRelatedEntity(form: FormGroup): void {
        const relatedEntitiesArray = form.get('relatedEntities') as FormArray;
        relatedEntitiesArray.push(this.createRelatedEntityForm());
    }

    removeRelatedEntity(form: FormGroup, index: number): void {
        const relatedEntitiesArray = form.get('relatedEntities') as FormArray;
        relatedEntitiesArray.removeAt(index);
    }
}
