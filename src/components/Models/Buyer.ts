import { IBuyer, TPayment, TCheckError } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class Buyer {
  protected payment: TPayment | null = null;
  protected address: string = "";
  protected email: string = "";
  protected phone: string = "";

  constructor(protected events: IEvents) {}

  getDataBuyer(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearDataBuyer(): void {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = "";
    this.events.emit('buyer:changed', this.getDataBuyer());
  }

  setDataBuyer(dataBuyer: Partial<IBuyer>): void {
    if (dataBuyer.payment !== undefined) {
      this.payment = dataBuyer.payment;
    }
    if (dataBuyer.address !== undefined) {
      this.address = dataBuyer.address;
    }
    if (dataBuyer.email !== undefined) {
      this.email = dataBuyer.email;
    }
    if (dataBuyer.phone !== undefined) {
      this.phone = dataBuyer.phone;
    }
    this.events.emit('buyer:changed', this.getDataBuyer());

  }

  checkDataBuyer(): TCheckError {
    const errors: TCheckError = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.email || this.email.trim().length === 0) {
      errors.email = "Укажите емэйл";
    }

    if (!this.phone || this.phone.trim().length === 0) {
      errors.phone = "Укажите номер телефона";
    }

    if (!this.address || this.address.trim().length === 0) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
