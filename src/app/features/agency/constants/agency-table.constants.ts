export interface AgencyColumn {
    field: string;
    header: string;
}

export class AgencyTableColumns {
    public static readonly COLUMNS: AgencyColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'actions', header: 'Actions' },
        { field: 'agencyName', header: 'Agency Name' },
        { field: 'address', header: 'Address' }
    ];

    public static readonly ADVANCED_COLUMNS: AgencyColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'actions', header: 'Actions' },
        { field: 'agencyName', header: 'Agency Name' },
        { field: 'address', header: 'Address' },
        { field: 'totalBillsAmount', header: 'Total Bills' },
        { field: 'totalPaidAmount', header: 'Total Paid' },
        { field: 'totalPendingAmount', header: 'Pending' }
    ];
}
