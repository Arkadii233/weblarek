import "./scss/styles.scss";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { CatalogModel } from "./components/Models/CatalogModel";
import { AppApi } from "./components/AppApi/AppApi";
import { Api } from "./components/base/Api";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

const catalog = new CatalogModel();
const basket = new BasketModel();
const buyer = new BuyerModel();
const api = new Api(API_URL);
const appApi = new AppApi(api);

catalog.setItems(apiProducts.items);
console.log("getItems:", catalog.getItems());
console.log(
    "getProduct (существующий):",
    catalog.getProduct(apiProducts.items[0].id),
);
console.log("getProduct (несуществующий):", catalog.getProduct("no-id"));
catalog.setSelectedProduct(apiProducts.items[0]);
console.log("getSelectedProduct:", catalog.getSelectedProduct());

basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log("getItems:", basket.getItems());
console.log("getItemCount:", basket.getItemCount());
console.log("getTotalPrice:", basket.getTotalPrice());
console.log("hasItem (существующий):", basket.hasItem(apiProducts.items[0].id));
console.log("hasItem (несуществующий):", basket.hasItem("no-id"));
basket.removeItem(apiProducts.items[0].id);
console.log("После removeItem getItems:", basket.getItems());
basket.clear();
console.log("После clear getItems:", basket.getItems());

buyer.setField("email", "test@test.ru");
buyer.setField("phone", "+71234567890");
buyer.setField("address", "Москва");
buyer.setField("payment", "online");
console.log("getData:", buyer.getData());
console.log("validateAll (заполнено):", buyer.validateAll());
buyer.clear();
console.log("После clear getData:", buyer.getData());
console.log("validateAll (пусто):", buyer.validateAll());

async function testApi() {
    try {
        const productsResponse = await appApi.getProducts();
        console.log("getProducts total:", productsResponse.total);
        console.log("getProducts items[0]:", productsResponse.items[0]);
    } catch (error) {
        console.error("Ошибка при запросе к серверу:", error);
    }
}
testApi();
