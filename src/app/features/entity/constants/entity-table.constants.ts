export interface EntityColumn {
    field: string;
    header: string;
}

export class EntityTableColumns {
    public static readonly COLUMNS: EntityColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'actions', header: 'Actions' },
        { field: 'entityName', header: 'Entity Name' },
        { field: 'displayName', header: 'Display Name' },
        { field: 'relatedEntitiesCount', header: 'Related Entities' },
    ];
}
