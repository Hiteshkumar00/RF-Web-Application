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
    dateFormat?: string | null;
    shortDateFormat?: string | null;
    enableSuggestions: boolean;
    whatsAppNumber?: string | null;
    enableWhatsApp: boolean;
    enableAdvancedWhatsApp: boolean;
    whatsAppPhoneNumberId?: string;
    whatsAppBusinessId?: string;
    whatsAppAccessToken?: string;
    enableEmail: boolean;
    emailSmtpHost?: string;
    emailSmtpPort?: number;
    emailSmtpUsername?: string;
    emailSmtpPassword?: string;
    emailSmtpEnableSsl: boolean;
}
