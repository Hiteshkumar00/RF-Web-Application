export interface CreateUserDto {
    accountId?: number | null;
    firstName: string;
    middleName?: string | null;
    surname: string;
    email: string;
    phoneNo?: string | null;
    role: string;
    password: string;
    isActive: boolean;
}
