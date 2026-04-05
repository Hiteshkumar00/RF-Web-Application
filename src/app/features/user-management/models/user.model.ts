export interface UserDto {
    id: number;
    accountId?: number | null;
    firstName: string;
    middleName?: string | null;
    surname: string;
    email: string;
    phoneNo?: string | null;
    role: string;
    isActive: boolean;
}
