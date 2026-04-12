export interface UserColumn {
    field: string;
    header: string;
}

export class UserTableColumns {
    public static readonly COLUMNS: UserColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'actions', header: 'Actions' },
        { field: 'firstName', header: 'First Name' },
        { field: 'surname', header: 'Surname' },
        { field: 'email', header: 'Email' },
        { field: 'role', header: 'Role' },
        { field: 'accountName', header: 'Account' },
        { field: 'isActive', header: 'Status' }
    ];
}
