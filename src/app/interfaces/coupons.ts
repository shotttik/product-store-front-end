export interface Coupon {
    ID: number;
    code: string;
    createDate: Date;
    endDate: Date;
    discount: number;
    isUsed: boolean;
}

export interface Expiration {
    name: string,
    code: string,
    days: number
}

export interface Discount {
    name: string,
    code: string,
    percentage: number,
}