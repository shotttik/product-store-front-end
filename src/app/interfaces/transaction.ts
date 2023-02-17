export interface TransactionS {
    Paid: number;
    Products: ProductS[];
    Coupon: string;
}

export interface ProductS {
    ID: number;
    Quantity: number;
}