export interface StockDto {
    id: number;
    productId: number;
    productName?: string;
    quantity: number;
    purchasePrice: number;
    discount: number;
    date?: string;
}

export interface CreateStockDto {
    productId: number;
    quantity: number;
    purchasePrice: number;
    discount: number;
}

export interface UpdateStockDto extends CreateStockDto {
    id?: number;
}
