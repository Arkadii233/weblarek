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
  onClick: () => {
    const product = productModel.getSelectedProduct();
    if (product) {
      events.emit("card:to-basket", product);
    }
  },
});

events.on("preview:changed", (product: IProduct) => {
  modal.render({
    content: cardPreview.render({
      ...product,
      buttonText: cartModel.checkProductCartById(product.id)
        ? "Удалить из корзины"
        : "В корзину",
    }),
  });

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

events.on("card:to-basket", (product: IProduct) => {
  if (!cartModel.checkProductCartById(product.id)) {
    cartModel.setProductCart(product);
  } else {
    cartModel.delProductCart(product);
  }
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

  const selectedProduct = productModel.getSelectedProduct();
  if (selectedProduct) {
    cardPreview.buttonText = cartModel.checkProductCartById(selectedProduct.id)
      ? "Удалить из корзины"
      : "В корзину";
  }
});

events.on("card:remove", (product: IProduct) => {
  cartModel.delProductCart(product);
});

// оформление заказа
const buyerModel = new Buyer(events);

const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const orderForm = new FormOrder(cloneTemplate(orderTemplate), {
  onInput: (field, value) => {
    if (field === "address") {
      buyerModel.setDataBuyer({ address: value });
    } else if (field === "payment") {
      buyerModel.setDataBuyer({
        payment: value === "card" || value === "cash" ? value : null,
      });
    }
  },
  onSubmit: () => events.emit("order:submit"),
});

const contactsForm = new FormContacts(cloneTemplate(contactsTemplate), {
  onInput: (field, value) => {
    if (field === "email") {
      buyerModel.setDataBuyer({ email: value });
    } else if (field === "phone") {
      buyerModel.setDataBuyer({ phone: value });
    }
  },
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
  onClick: () => {
    modal.closeModal();
  },
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
