export class ContributionConstants {
    public static readonly ADD_CONTRIBUTION_TITLE = 'Add Contribution';
    public static readonly REMOVE_CONTRIBUTION_TITLE = 'Remove Contribution';
    
    public static readonly MESSAGES = {
        CREATE_SUCCESS: (title: string) => `${title} created successfully.`,
        UPDATE_SUCCESS: (title: string) => `${title} updated successfully.`,
        DELETE_SUCCESS: (title: string) => `${title} deleted successfully.`,
        DELETE_CONFIRM: (title: string) => `Are you sure you want to delete this ${title.toLowerCase()}?`,
        UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to close?'
    };
}
