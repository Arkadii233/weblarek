import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class Catalog {
  private product: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  getProduct(): IProduct[] {
    return this.product;
  }

  setProduct(product: IProduct[]): void {
    this.product = product;
    this.events.emit('items:changed', { items: this.product });
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  setSelectedProduct(selectedProduct: IProduct): void {
    this.selectedProduct = selectedProduct;
    this.events.emit('preview:changed', this.selectedProduct);
  }

  getProductById(id: string): IProduct | undefined {
    return this.product.find((product) => product.id === id);
  }
}
