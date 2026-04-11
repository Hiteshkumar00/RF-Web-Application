export class AgencyPersonLabels {
    // Page
    public static readonly PAGE_TITLE = 'Agency Person Management';

    // Buttons
    public static readonly ADD_PERSON = 'Add Person';
    public static readonly SAVE = 'Save';
    public static readonly CANCEL = 'Cancel';
    public static readonly EDIT = 'Edit';
    public static readonly VIEW = 'View';
    public static readonly DELETE = 'Delete';
    public static readonly YES = 'Yes';
    public static readonly NO = 'No';

    // Dialog titles
    public static readonly CREATE_DIALOG_TITLE = 'Create Agency Person';
    public static readonly UPDATE_DIALOG_TITLE = 'Update Agency Person';
    public static readonly VIEW_DIALOG_TITLE = 'View Agency Person';

    // Form fields
    public static readonly NAME = 'Full Name';
    public static readonly AGENCY = 'Agency';
    public static readonly PHONE_NO = 'Phone Number';
    public static readonly EMAIL = 'Email';
    public static readonly OCCUPATION = 'Occupation';
    public static readonly ADDRESS = 'Address';

    // Validation messages
    public static readonly NAME_REQUIRED = 'Name is required.';
    public static readonly NAME_MAX = 'Name cannot exceed 250 characters.';
    public static readonly AGENCY_REQUIRED = 'Agency is required.';
    public static readonly EMAIL_INVALID = 'Please enter a valid email address.';
    public static readonly PHONE_MAX = 'Phone number cannot exceed 50 characters.';
    public static readonly EMAIL_MAX = 'Email cannot exceed 250 characters.';
    public static readonly OCCUPATION_MAX = 'Occupation cannot exceed 250 characters.';

    // Confirm dialogs
    public static readonly DELETE_CONFIRM_HEADER = 'Confirm Delete';
    public static readonly DELETE_CONFIRM_MESSAGE = 'Are you sure you want to delete this agency person?';
    public static readonly UNSAVED_CONFIRM_HEADER = 'Unsaved Changes';
    public static readonly UNSAVED_CONFIRM_MESSAGE = 'You have unsaved changes. Do you want to discard them and close?';

    // Table
    public static readonly NO_RECORDS = 'No agency persons found.';
}
