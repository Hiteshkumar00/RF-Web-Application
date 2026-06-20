export interface CustomerDto {
  id: number;
  accountId: number;
  customerName: string;
  phoneNo?: string;
  email?: string;
  address?: string;
}

export interface CreateCustomerDto {
  customerName: string;
  phoneNo?: string;
  email?: string;
  address?: string;
}

export interface UpdateCustomerDto {
  id: number;
  customerName: string;
  phoneNo?: string;
  email?: string;
  address?: string;
}

export interface CustomerListDto {
  id: number;
  customerName: string;
  phoneNo?: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  totalNetAmount: number;
  totalRemainingAmount: number;
}
