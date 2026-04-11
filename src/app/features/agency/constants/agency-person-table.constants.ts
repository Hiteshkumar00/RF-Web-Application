export interface AgencyPersonColumn {
    field: string;
    header: string;
}

export class AgencyPersonTableColumns {
    public static readonly COLUMNS: AgencyPersonColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'actions', header: 'Actions' },
        { field: 'name', header: 'Full Name' },
        { field: 'agencyName', header: 'Agency Name' },
        { field: 'phoneNo', header: 'Phone Number' },
        { field: 'personOccupation', header: 'Occupation' }
    ];
}
