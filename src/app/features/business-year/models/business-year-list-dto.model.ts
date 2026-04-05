export class BusinessYearListDto {
    id: number = 0;
    accountId?: number;
    yearName: string = '';
    startDate?: Date | string;
    endDate?: Date | string;
    isSelected: boolean = false;
}
