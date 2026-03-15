export interface CreateRelatedEntityDto {
    relatedEntityName: string;
    relatedDisplayName?: string | null;
}

export interface CreateEntityDto {
    entityName: string;
    displayName?: string | null;
    relatedEntities?: CreateRelatedEntityDto[] | null;
}
