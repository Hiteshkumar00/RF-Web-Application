export interface UpdateAccountDto {
    id: number;
    profileName: string;
    profileLogoLink?: string | null;
    currencyType?: string | null;
}
