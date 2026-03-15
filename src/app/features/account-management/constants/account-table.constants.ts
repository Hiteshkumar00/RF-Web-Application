export interface AccountColumn {
    field: string;
    header: string;
}

export class AccountTableColumns {
    public static readonly COLUMNS: AccountColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'profileName', header: 'Profile Name' },
        { field: 'currencyType', header: 'Currency' },
    ];
}
