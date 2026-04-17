export interface AccountDto {
    id: number;
    profileName: string;
    profileLogoLink?: string | null;
    currencyType?: string | null;
    enableSuggestions: boolean;
}
