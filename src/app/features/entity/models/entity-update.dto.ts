export interface UpdateRelatedEntityDto {
    id?: number | null;
    relatedEntityName: string;
    relatedDisplayName?: string | null;
}

export interface UpdateEntityDto {
    id: number;
    entityName: string;
    displayName?: string | null;
    relatedEntities?: UpdateRelatedEntityDto[] | null;
}
