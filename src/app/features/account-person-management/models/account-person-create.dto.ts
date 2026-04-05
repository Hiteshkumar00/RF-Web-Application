export interface CreateAccountPersonDto {
    name: string;
    phoneNo?: string | null;
    email?: string | null;
    personOccupation?: string | null;
    address?: string | null;
}
