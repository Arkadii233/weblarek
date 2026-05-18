import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IBasket {
  list: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  private listBasket: HTMLElement;
  private totalPrice: HTMLElement;
  private buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.listBasket = ensureElement('.basket__list',container);
    this.totalPrice = ensureElement('.basket__price',container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button',container);

    this.buttonElement.addEventListener('click', () => {
      this.events.emit('order:open');
    });

     this.list = [];
  }

  set list (items: HTMLElement[]) {
    if (items.length > 0) {
      this.listBasket.replaceChildren(...items);
      this.buttonElement.disabled = false;
    }
    else {
      this.listBasket.replaceChildren();
      this.buttonElement.disabled = true;
    }
  }

  set total (valueTotalPrice: number) {
    this.totalPrice.textContent = `${valueTotalPrice} синапсов`;
  }
}