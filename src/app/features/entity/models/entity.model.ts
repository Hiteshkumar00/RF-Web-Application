export interface RelatedEntityDto {
    id?: number | null;
    relatedEntityName: string;
    relatedDisplayName?: string | null;
}

export interface EntityDto {
    id: number;
    entityName: string;
    displayName?: string | null;
    relatedEntities?: RelatedEntityDto[] | null;
}
