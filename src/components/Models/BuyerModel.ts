import { TPayment, IBuyer, TBuyerErrors } from "../../types/index";

export class BuyerModel {
    private _payment: TPayment | null;
    private _address: string;
    private _phone: string;
    private _email: string;

    constructor() {
        this._address = "";
        this._email = "";
        this._phone = "";
        this._payment = null;
    }

    setField(data: Partial<IBuyer>): void { 
        if (data.payment !== undefined) { 
            this._payment = data.payment; 
        } 
        if (data.email !== undefined) { 
            this._email = data.email; 
        } 
        if (data.phone !== undefined) { 
            this._phone = data.phone; 
        } 
        if (data.address !== undefined) { 
            this._address = data.address; 
        } 
    }  

    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address,
        };
    }

    clear(): void {
        this._payment = null;
        this._address = "";
        this._phone = "";
        this._email = "";
    }

    validateAll(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this._payment) {
            errors.payment = "Не выбран способ оплаты";
        }
        if (!this._email) {
            errors.email = "Укажите email";
        }
        if (!this._phone) {
            errors.phone = "Укажите телефон";
        }
        if (!this._address) {
            errors.address = "Укажите адрес";
        }

        return errors;
    }
}
