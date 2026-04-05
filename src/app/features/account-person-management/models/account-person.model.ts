export interface AccountPersonDto {
    id: number;
    name: string;
    phoneNo?: string | null;
    email?: string | null;
    personOccupation?: string | null;
    address?: string | null;
}
