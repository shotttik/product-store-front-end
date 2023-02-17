export class CouponModel {
    public ID: number;
    public Code: string;
    public CreateDate: Date;
    public EndDate: Date;
    public Discount: number;

    constructor(ID: number, Code: string, CreateDate: Date, EndDate: Date, Discount: number) {
        this.ID = ID;
        this.Code = Code;
        this.CreateDate = CreateDate;
        this.EndDate = EndDate;
        this.Discount = Discount;
    }

}