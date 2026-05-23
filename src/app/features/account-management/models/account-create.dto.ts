export interface CreateAccountDto {
    profileName: string;
    profileLogoLink?: string | null;
    signatureLink?: string | null;
    currencyType?: string | null;
}
