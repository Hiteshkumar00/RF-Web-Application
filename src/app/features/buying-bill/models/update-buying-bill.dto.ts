import { UpdateBuyingBillExpenceDto } from "./buying-bill-expence.dto";
import { UpdateStockDto } from "./buying-bill-item.dto";

export interface UpdateBuyingBillDto {
    id: number;
    agencyId: number;
    billNo: string;
    date: string | Date;
    stocks: UpdateStockDto[];
    expences: UpdateBuyingBillExpenceDto[];
}

