export class ExpenseLabels {
    public static readonly PAGE_TITLE = 'Business Expense Management';
    public static readonly CREATE_DIALOG_TITLE = 'Add New Expense';
    public static readonly UPDATE_DIALOG_TITLE = 'Update Expense';
    public static readonly VIEW_DIALOG_TITLE = 'View Expense Details';

    // Buttons
    public static readonly ADD_EXPENSE = 'Add Expense';
    public static readonly SAVE = 'Save';
    public static readonly CANCEL = 'Cancel';
    public static readonly EDIT = 'Edit';
    public static readonly VIEW = 'View';
    public static readonly DELETE = 'Delete';
    public static readonly YES = 'Yes';
    public static readonly NO = 'No';
    public static readonly ADD_PAYMENT = 'Add Payment';
    public static readonly REMOVE_PAYMENT = 'Remove';

    // Form fields
    public static readonly EXPENSE_TYPE = 'Expense Type';
    public static readonly DATE = 'Expense Date';
    public static readonly PAYMENTS_SECTION = 'Payment Details';
    public static readonly AMOUNT = 'Amount';
    public static readonly PAYMENT_ACCOUNT = 'Payment Account';

    // Validations
    public static readonly EXPENSE_TYPE_REQUIRED = 'Expense type is required.';
    public static readonly DATE_REQUIRED = 'Date is required.';
    public static readonly AMOUNT_REQUIRED = 'Amount is required.';
    public static readonly AMOUNT_MIN = 'Amount must be greater than 0.';
    public static readonly ACCOUNT_REQUIRED = 'Account is required.';

    // Confirmations
    public static readonly DELETE_HEADER = 'Confirm Deletion';
    public static readonly DELETE_MESSAGE = 'Are you sure you want to delete this expense record?';
    public static readonly UNSAVED_HEADER = 'Unsaved Changes';
    public static readonly UNSAVED_MESSAGE = 'You have unsaved changes. Are you sure you want to close?';

    public static readonly NO_RECORDS = 'No expenses found.';
}
