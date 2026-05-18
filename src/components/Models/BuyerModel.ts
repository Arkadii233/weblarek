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

    setField(field: keyof IBuyer, value: string): void {
        if (field === "payment") {
            this._payment = value as TPayment;
        } else if (field === "email") {
            this._email = value as string;
        } else if (field === "address") {
            this._address = value as string;
        } else if (field === "phone") {
            this._phone = value as string;
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
