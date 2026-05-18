import { IOrder, IOrderResult, IProductsResponse } from "../../types/index";
import { IApi } from "../../types/index";

export class AppApi {
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    // GET /product/ — получить список товаров
    getProducts(): Promise<IProductsResponse> {
        return this._baseApi.get<IProductsResponse>("/product/");
    }

    // POST /order — отправить заказ
    postOrder(order: IOrder): Promise<IOrderResult> {
        return this._baseApi.post<IOrderResult>("/order", order);
    }
}
