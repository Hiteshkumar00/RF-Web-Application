export interface UpdateAccountDto {
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
    enableVoiceTyping: boolean;
    whatsAppNumber?: string | null;
    enableWhatsApp: boolean;
    enableAdvancedWhatsApp: boolean;
    whatsAppPhoneNumberId?: string | null;
    whatsAppBusinessId?: string | null;
    whatsAppAccessToken?: string | null;
    enableEmail: boolean;
    emailSmtpHost?: string | null;
    emailSmtpPort?: number | null;
    emailSmtpUsername?: string | null;
    emailSmtpPassword?: string | null;
    emailSmtpEnableSsl: boolean;
}
