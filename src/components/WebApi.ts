import { IApi, IProductList, IOrder, IOrderResult } from "../types";

export class WebApi {
  private api: IApi;
  constructor(api: IApi) {
    this.api = api;
  }

  async getProductList(): Promise<IProductList> {
    return await this.api.get<IProductList>("/product");
  }

  async orderProduct(order: IOrder): Promise<IOrderResult> {
    return await this.api.post<IOrderResult>("/order", order);
  }
}
