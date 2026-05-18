import { IProduct } from "../../types";
import { IEvents } from "../base/Events.ts";

export class Cart {
  private productCart: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getProductCart(): IProduct[] {
    return this.productCart;
  }

  setProductCart(product: IProduct): void {
    this.productCart.push(product);
    this.events.emit('cart:changed', this.productCart);
  }

  delProductCart(product: IProduct): void {
    if (this.productCart) {
      this.productCart = this.productCart.filter(
        (item) => item.id !== product.id,
      );
    }
    this.events.emit('cart:changed', this.productCart);
  }

  clearCart(): void {
    this.productCart = [];
    this.events.emit('cart:changed', this.productCart);
  }

  getTotalPrice(): number {
    if (this.productCart) {
      return this.productCart.reduce((total, product) => {
        if (product.price) {
          total = total + product.price;
        }
        return total;
      }, 0);
    }
    return 0;
  }

  getCountProduct(): number {
    if (this.productCart) {
      return this.productCart.length;
    }
    return 0;
  }

  checkProductCartById(id: string): boolean {
    if (this.productCart) {
      return this.productCart.some((product) => product.id === id);
    }
    return false;
  }
}
