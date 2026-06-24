import "./scss/styles.scss";

import { Catalog } from "./components/Models/Catalog.ts";
import { Buyer } from "./components/Models/Buyer.ts";
import { Cart } from "./components/Models/Cart.ts";
//import { apiProducts } from "./utils/data.ts";

import { Api } from "./components/base/Api.ts";
import { WebApi } from "./components/WebApi.ts";
import { API_URL } from "./utils/constants.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { Gallery } from "./components/views/Gallery.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import { CardCatalog } from "./components/views/CardCatalog.ts";
import { IProduct } from "./types/index.ts";
import { CardPreview } from "./components/views/CardPreview.ts";
import { Modal } from "./components/views/Modal.ts";
import { Header } from "./components/views/Header.ts";
import { Basket } from "./components/views/Basket.ts";
import { CardBasket } from "./components/views/CardBasket.ts";
import { FormOrder } from "./components/views/FormOrder.ts";
import { FormContacts } from "./components/views/FormContacts.ts";
import { Success } from "./components/views/Success.ts";
import { IOrder, IBuyer } from "./types/index.ts";
import { CDN_URL } from "./utils/constants.ts";

const events = new EventEmitter();

// загрузка каталога товаров на главную страницуу
const productModel = new Catalog(events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

events.on("items:changed", () => {
  const products = productModel.getProduct();

  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", product),
    });
    return card.render(product);
  });
  gallery.render({ catalog: cards });
});

events.on("card:select", (product: IProduct) => {
  productModel.setSelectedProduct(product);
});

// открытие превью
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onClick: () => events.emit("card:to-basket"), 
}); 

events.on("preview:changed", (product: IProduct) => {
  const buttonText = product.price === null 
    ? "Не продается" 
    : cartModel.checkProductCartById(product.id)
      ? "Удалить из корзины" 
      : "В корзину";

  let buttonInitialText = cartModel.checkProductCartById(product.id)
    ? "Удалить из корзины"
    : "В корзину";

  if (product.price === null) {
    buttonInitialText = "Не продается";
  }

  modal.render({
    content: cardPreview.render({
      ...product,
      buttonText: buttonInitialText,
      disabledButton: product.price === null,
    }),
  });

  modal.openModal();
});

// изменение счетчика корзины в шапке при добавлении товара
const cartModel = new Cart(events);
const header = new Header(ensureElement<HTMLElement>(".header"), events);

events.on("card:to-basket", () => {
  // Берём выбранный продукт из модели
  const product = productModel.getSelectedProduct();
  
  // Проверяем, что продукт существует
  if (!product) {
    console.error("Товар не выбран");
    return;
  }
  
  // Проверяем цену (бесценные товары нельзя добавить)
  if (product.price === null) {
    alert("Этот товар не продается");
    return;
  }
  
  // Добавляем или удаляем из корзины
  if (!cartModel.checkProductCartById(product.id)) {
    cartModel.setProductCart(product);
  } else {
    cartModel.delProductCart(product);
  }
  
  // Закрываем модальное окно
  modal.closeModal();
});

//открытие и работа с корзиной
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

const basket = new Basket(cloneTemplate(basketTemplate), events);

events.on("basket:open", () => {
  modal.render({
    content: basket.render(),
  });
  modal.openModal();
});

events.on("cart:changed", () => {
  header.counter = cartModel.getCountProduct();

  const items = cartModel.getProductCart().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit("card:remove", product),
    });
    return card.render({
      index: index + 1,
      title: product.title,
      price: product.price,
    });
  });

  basket.render({
    list: items,
    total: cartModel.getTotalPrice(),
  });
});
events.on("card:remove", (product: IProduct) => {
  cartModel.delProductCart(product);
});

// оформление заказа
const buyerModel = new Buyer(events);

events.on('buyer:change', (data: { field: string; value: string }) => {
    buyerModel.setDataBuyer({ [data.field]: data.value });
});

const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const orderForm = new FormOrder(cloneTemplate(orderTemplate), {
  onInput: (field, value) => events.emit('buyer:change', { field, value }),
  onSubmit: () => events.emit("order:submit"),
});

const contactsForm = new FormContacts(cloneTemplate(contactsTemplate), {
  onInput: (field, value) => events.emit('buyer:change', { field, value }),
  onSubmit: () => events.emit("contacts:submit"),
});

events.on("buyer:changed", (buyer: IBuyer) => {
  orderForm.payment = buyer.payment || "";
  orderForm.address = buyer.address || "";

  contactsForm.email = buyer.email || "";
  contactsForm.phone = buyer.phone || "";

  const errors = buyerModel.checkDataBuyer();
  const { payment, address, email, phone } = errors;

  orderForm.valid = !payment && !address;
  const orderErrors: string[] = [];
  if (payment) orderErrors.push(payment);
  if (address) orderErrors.push(address);
  orderForm.errors = orderErrors;

  contactsForm.valid = !email && !phone;
  const contactsErrors: string[] = [];
  if (email) contactsErrors.push(email);
  if (phone) contactsErrors.push(phone);
  contactsForm.errors = contactsErrors;
});

events.on("order:open", () => {
  modal.render({
    content: orderForm.render(),
  });
});

events.on("order:submit", () => {
  modal.render({
    content: contactsForm.render(),
  });
});

const success = new Success(cloneTemplate(successTemplate), { 
  onClick: () => events.emit("success:close"),
}); 

events.on("success:close", () => {
  modal.closeModal();
});

events.on("contacts:submit", () => {
  const orderData: IOrder = {
    ...buyerModel.getDataBuyer(),
    items: cartModel.getProductCart().map((item) => item.id),
    total: cartModel.getTotalPrice(),
  };

  webApi
    .orderProduct(orderData)
    .then((result) => {
      cartModel.clearCart();
      buyerModel.clearDataBuyer();

      modal.render({
        content: success.render({
          totalPrice: result.total,
        }),
      });
    })
    .catch((err) => {
      console.error("Ошибка оформления заказа:", err);
    });
});

// закрытие окна по "крестику"

events.on("modal:close", () => {
  modal.closeModal();
});

const api = new Api(API_URL);
const webApi = new WebApi(api);

webApi
  .getProductList() //вызов getProductList проверен, данные с сервера пришли
  .then((productList) => {
    const items = productList.items.map((item) => ({
      ...item,
      image: CDN_URL + item.image,
    }));
    productModel.setProduct(items);
    console.log("Список продуктов с сервера: ", productModel.getProduct());
  })
  .catch((error) => {
    console.error("Ошибка при получении списка продуктов: ", error);
  });
