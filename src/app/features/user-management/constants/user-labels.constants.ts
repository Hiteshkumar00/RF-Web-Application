export class UserLabels {
    // Page
    public static readonly PAGE_TITLE = 'User Management';

    // Buttons
    public static readonly ADD_USER = 'Add User';
    public static readonly SAVE = 'Save';
    public static readonly CANCEL = 'Cancel';
    public static readonly EDIT = 'Edit';
    public static readonly VIEW = 'View';
    public static readonly DELETE = 'Delete';
    public static readonly RESET_PASSWORD = 'Reset Password';
    public static readonly ACTIVATE = 'Activate';
    public static readonly DEACTIVATE = 'Deactivate';
    public static readonly YES = 'Yes';
    public static readonly NO = 'No';

    // Dialog titles
    public static readonly CREATE_DIALOG_TITLE = 'Create User';
    public static readonly UPDATE_DIALOG_TITLE = 'Update User';
    public static readonly VIEW_DIALOG_TITLE = 'User Details';

    // Form fields
    public static readonly FIRST_NAME = 'First Name';
    public static readonly MIDDLE_NAME = 'Middle Name';
    public static readonly SURNAME = 'Surname';
    public static readonly EMAIL = 'Email';
    public static readonly PHONE_NO = 'Phone Number';
    public static readonly ROLE = 'Role';
    public static readonly ACCOUNT = 'Account';
    public static readonly PASSWORD = 'Password';
    public static readonly IS_ACTIVE = 'Active';

    // Validation messages
    public static readonly FIRST_NAME_REQUIRED = 'First name is required.';
    public static readonly FIRST_NAME_MAX = 'First name cannot exceed 100 characters.';
    public static readonly SURNAME_REQUIRED = 'Surname is required.';
    public static readonly SURNAME_MAX = 'Surname cannot exceed 100 characters.';
    public static readonly EMAIL_REQUIRED = 'A valid email address is required.';
    public static readonly ROLE_REQUIRED = 'Role is required.';
    public static readonly PASSWORD_REQUIRED = 'Password is required.';
    public static readonly PASSWORD_MIN = 'Password must be at least 8 characters.';
    public static readonly PASSWORD_MAX = 'Password cannot exceed 100 characters.';
    public static readonly ACCOUNT_REQUIRED = 'Account is required for Admin role.';

    // Confirm dialogs
    public static readonly DELETE_CONFIRM_HEADER = 'Confirm Delete';
    public static readonly DELETE_CONFIRM_MESSAGE = 'Are you sure you want to delete this user?';
    public static readonly TOGGLE_ACTIVE_CONFIRM_HEADER = 'Confirm Status Change';
    public static readonly TOGGLE_ACTIVE_CONFIRM_MESSAGE = 'Are you sure you want to change the active status of this user?';
    public static readonly RESET_PASSWORD_HEADER = 'Reset Password';
    public static readonly RESET_PASSWORD_MESSAGE = 'Enter a new password for this user.';
    public static readonly UNSAVED_CONFIRM_HEADER = 'Unsaved Changes';
    public static readonly UNSAVED_CONFIRM_MESSAGE = 'You have unsaved changes. Do you want to discard them and close?';

    // Table
    public static readonly NO_RECORDS = 'No users found.';

    // View labels
    public static readonly USER_ID = 'User ID';
    public static readonly ACCOUNT_ID = 'Account ID';
    public static readonly FULL_NAME = 'Full Name';
    public static readonly STATUS = 'Status';
    public static readonly ACTIVE = 'Active';
    public static readonly INACTIVE = 'Inactive';
}
