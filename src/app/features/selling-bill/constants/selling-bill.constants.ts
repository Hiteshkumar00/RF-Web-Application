export class SellingBillConstants {
    public static readonly SELLING_BILL_TITLE = 'Selling Bill';
    
    public static readonly LABELS = {
        BILL_NO: 'Bill No',
        CUSTOMER_NAME: 'Customer Name',
        EMAIL: 'Email',
        PHONE_NO: 'Phone No',
        ADDRESS: 'Address',
        DATE: 'Date',
        DISCOUNT: 'Discount',
        ITEMS_SECTION: 'Items Details',
        PAYMENTS_SECTION: 'Payment Details',
        ITEM_NAME: 'Item Name',
        QUANTITY: 'Quantity',
        PRICE: 'Price',
        TOTAL: 'Total',
        WARRENTY: 'Warrenty',
        YEAR: 'Year',
        MONTH: 'Month',
        DAY: 'Day',
        PAYMENT_ACCOUNT: 'Payment Account',
        AMOUNT: 'Amount',
        TOTAL_AMOUNT: 'Base Amount',
        NET_AMOUNT: 'Net Amount',
        PAID_AMOUNT: 'Paid Amount',
        REMAINING_AMOUNT: 'Remaining'
    };

    public static readonly VALIDATION = {
        REQUIRED: 'This field is required',
        MIN_0_01: 'Value must be at least 0.01',
        MIN_1: 'Value must be at least 1'
    };

    public static readonly MESSAGES = {
        CREATE_SUCCESS: (title: string) => `${title} created successfully.`,
        UPDATE_SUCCESS: (title: string) => `${title} updated successfully.`,
        DELETE_SUCCESS: (title: string) => `${title} deleted successfully.`,
        DELETE_CONFIRM: (title: string) => `Are you sure you want to delete this ${title.toLowerCase()}?`,
        UNSAVED_CHANGES: 'You have unsaved changes. Do you want to close?'
    };
}
