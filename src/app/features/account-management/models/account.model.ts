export interface AccountDto {
    id: number;
    profileName: string;
    profileLogoLink?: string | null;
    title?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    gstin?: string | null;
    currencyType?: string | null;
    enableSuggestions: boolean;
    whatsAppNumber?: string | null;
    enableWhatsApp: boolean;
}
