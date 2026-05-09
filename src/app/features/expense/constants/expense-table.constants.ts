export class ExpenseTableColumns {
    public static readonly COLUMNS = [
        { field: 'id', header: 'ID' },
        { field: 'actions', header: 'Actions' },
        { field: 'expenceType', header: 'Expense Type' },
        { field: 'agencyName', header: 'Agency (Bill)' },
        { field: 'date', header: 'Date' },
        { field: 'totalAmount', header: 'Total Amount' },
        { field: 'paidAmount', header: 'Paid' },
        { field: 'remainingAmount', header: 'Remaining' }
    ];
}
