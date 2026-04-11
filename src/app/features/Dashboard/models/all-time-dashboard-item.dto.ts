import { DashboardDto } from './dashboard.dto';

export interface AllTimeDashboardItemDto extends DashboardDto {
    businessYearId: number;
    businessYearName: string;
    startDate: string;
    endDate: string;
}
