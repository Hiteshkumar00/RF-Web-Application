export interface AgencyPersonDto {
    id: number;
    agencyId: number;
    agencyName?: string;
    name: string;
    phoneNo: string | null;
    email: string | null;
    personOccupation: string | null;
    address: string | null;
}
