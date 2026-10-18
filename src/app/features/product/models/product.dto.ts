export interface ProductDto {
  id: number;
  accountId?: number;
  productName: string;
  imageLink?: string;
  warrantyYear?: number;
  warrantyMonth?: number;
  warrantyDay?: number;
  price?: number;
}

export interface CreateProductDto {
  productName: string;
  imageLink?: string;
  warrantyYear?: number;
  warrantyMonth?: number;
  warrantyDay?: number;
  price?: number;
}

export interface UpdateProductDto extends CreateProductDto {
  id: number;
}

export interface ProductFilterDto {
  searchTerm?: string;
}
